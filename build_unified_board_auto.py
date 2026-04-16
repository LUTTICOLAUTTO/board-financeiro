from __future__ import annotations

import argparse
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

from build_unified_board import build_slides
from board_pptx_lib import build_deck


ROOT = Path("/Users/lutti/Documents/New project")
DEFAULT_EXPENSES = Path("/Users/lutti/Library/Containers/com.apple.mail/Data/Library/Mail Downloads/33E52018-EE7C-45A8-8BB7-3AC042839267/DESPESAS 2026_15.04.xlsx")
DEFAULT_CASH_JSON = ROOT / "data/cash_snapshot_current.json"
DEFAULT_CASH_EXCEL = ROOT / "data/cash_source.xlsx"
DEFAULT_OUTPUT = ROOT / "Board_Integrado_Auto.pptx"
DEFAULT_OUTPUT_INPUT = ROOT / "data/board_input_generated.json"
DEFAULT_GENERATED_CASH = ROOT / "data/cash_snapshot_generated.json"
DEFAULT_DESKTOP = Path("/Users/lutti/Desktop/Board_Integrado_Auto.pptx")
DEFAULT_TEMPLATE = Path("/Users/lutti/Desktop/Lampada_Analise de resultados 2025 - fev26.pptx")
NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def col_to_num(col: str) -> int:
    n = 0
    for ch in col:
        if ch.isalpha():
            n = n * 26 + ord(ch.upper()) - 64
    return n


def parse_xlsx(path: Path) -> dict[str, list[list[str]]]:
    with zipfile.ZipFile(path) as z:
        shared: list[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in root.findall("a:si", NS):
                shared.append("".join(t.text or "" for t in si.iterfind(".//a:t", NS)))

        wb = ET.fromstring(z.read("xl/workbook.xml"))
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        relmap = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}
        out: dict[str, list[list[str]]] = {}

        for s in wb.find("a:sheets", NS):
            name = s.attrib["name"]
            target = relmap[s.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]]
            xml_path = "xl/" + target if not target.startswith("xl/") else target
            root = ET.fromstring(z.read(xml_path))
            rows: list[list[str]] = []
            maxc = 0
            for row in root.findall(".//a:sheetData/a:row", NS):
                vals: dict[int, str] = {}
                for c in row.findall("a:c", NS):
                    ref = c.attrib.get("r", "A1")
                    match = re.match(r"([A-Z]+)(\d+)", ref)
                    if not match:
                        continue
                    idx = col_to_num(match.group(1))
                    maxc = max(maxc, idx)
                    t = c.attrib.get("t")
                    v = c.find("a:v", NS)
                    inline = c.find("a:is", NS)
                    val = ""
                    if t == "s" and v is not None and v.text is not None:
                        val = shared[int(v.text)]
                    elif t == "inlineStr" and inline is not None:
                        val = "".join(x.text or "" for x in inline.iterfind(".//a:t", NS))
                    elif v is not None and v.text is not None:
                        val = v.text
                    vals[idx] = val
                rows.append([vals.get(i, "") for i in range(1, maxc + 1)])
            out[name] = rows
    return out


def f(value: str) -> float:
    try:
        return float(str(value).strip())
    except Exception:
        return 0.0


def s(value: str) -> str:
    return str(value).strip()


def normalize_text(value: str) -> str:
    text = unicodedata.normalize("NFKD", s(value))
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.lower().replace("/", " ").replace("-", " ").replace("_", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_date_from_text(value: str) -> date | None:
    match = re.search(r"(\d{2})/(\d{2})/(\d{2,4})", s(value))
    if not match:
        return None
    day, month, year = match.groups()
    year_i = int(year)
    if year_i < 100:
        year_i += 2000
    try:
        return date(year_i, int(month), int(day))
    except ValueError:
        return None


def parse_excel_serial_date(value: str) -> date | None:
    text = s(value)
    if not re.fullmatch(r"\d+(\.\d+)?", text):
        return None
    serial = float(text)
    if serial < 30000 or serial > 70000:
        return None
    base = datetime(1899, 12, 30)
    try:
        return (base + timedelta(days=serial)).date()
    except Exception:
        return None


def detect_cash_row_key(label: str) -> str | None:
    norm = normalize_text(label)
    patterns = {
        "opening_balance": ["saldo inicial dia"],
        "receipts": ["recebimentos", "recebimento"],
        "payments": ["pagamento", "pagamentos"],
        "ending_balance": ["saldo final c c", "saldo final cc", "saldo final c"],
        "to_invoice": ["prev a faturar", "prev faturar"],
        "receivable": ["a receber"],
        "anticipated": ["antecipados"],
        "company_loans": ["emprestimo cp"],
        "cash_accumulated_ytd": ["saldo acumulado"],
    }
    for key, options in patterns.items():
        if any(option in norm for option in options):
            return key
    return None


def categorize_vendor(name: str) -> str:
    upper = name.upper()
    categories = {
        "Sócios/retiradas": ["LUTTI COLAUTTO", "CDR LUTTI - 30% LAMPADA"],
        "Folha e equipe fixa": [
            "ADRIANA AGGIO", "ALEXANDRE PONTES", "ANA BARBARA", "ANA BARROS", "ARIADNE NEVES",
            "BRUNO CESAR NOGUEIRA", "CAROL DE P. ORBERG", "CAROLINA TRIBST", "CASSIA ORNELLAS",
            "CRISTIANE STRUTZEL", "EMERSON RINALDI", "FABIANE MADRILES", "FERNANDA ALCANTARA",
            "PAULO LEMES DA", "RODRIGO ROSETE", "VICTOR CRUZ DA SILVA", "ADALGISA PIRES FALCAO",
            "RICARDO YAMAGUTI", "RODRIGO PENELLA", "ANGELO MARCIO DOS SANTOS AZEVEDO",
            "LIVIA SAMPAIO", "LARISSA DOS SANTOS SILVA", "DIEISY BRUNA SANTOS PORTO MYRA MOREIRA",
            "GILSON ANDRADE", "MARCELO BASTOS FELIPPE", "ELAINE DE SOUZA"
        ],
        "Benefícios e saúde": ["OMINT", "PORTO SEGURO", "CAJU", "ALELO CARTOES PRE PAGO", "WELLHUB", "CLARO"],
        "Bancos e tarifas": ["BANCO", "CONSORCIO", "ANUIDADE", "SEMPARAR", "TARIFA BANCARIA", "TT CAPITALIZAÇÃO CAIXA"],
        "Tributos e parcelamentos": ["MINISTERIO", "SECRETARIA", "FGTS", "DOCTO DE ARRECADAÇÃO", "PREF DO MUN", "DAS", "PGFN", "PERT"],
        "Infraestrutura": ["REBECA ADMINISTRADORA", "ENEL", "CONTROL-E", "PROGRESS", "PUBLISIS", "A1 SERVICOS DE LIMPEZA", "ALICERCE X"],
        "Diversos discricionários": ["UBER", "PADARIA", "PAO DE", "PÃO DE", "MAMBO", "TRATORIA", "LINDT", "SODIE", "CHE BARBARO", "MERCADO LIVRE", "WINE LOCALS", "LEVYCAM", "EXECUTIVO EXPRESS", "ESTACIONAMENTO", "KOPENHAGEN", "DROGASIL", "99TAXIS"],
    }
    for category, keys in categories.items():
        if any(key.upper() in upper for key in keys):
            return category
    return "Outros estrutura"


def parse_expenses(path: Path, base_date: date) -> dict:
    wb = parse_xlsx(path)
    records = []

    for sheet, rows in wb.items():
        if not re.match(r"\d{2}\.\d{2}", sheet):
            continue
        day, month = sheet.split(".")
        sheet_date = date(base_date.year, int(month), int(day))
        for row in rows[1:]:
            if len(row) < 8:
                continue
            if len(row) >= 10 and s(row[1]) and s(row[8]):
                tipo = s(row[2])
                pit = s(row[5])
                fornecedor = s(row[6])
                valor = f(row[8])
                origem = s(row[9])
            else:
                tipo = s(row[1])
                pit = s(row[4])
                fornecedor = s(row[5])
                valor = f(row[6])
                origem = s(row[7])
            if valor <= 0 or not fornecedor:
                continue
            records.append(
                {
                    "date": sheet_date,
                    "tipo": tipo,
                    "pit": pit,
                    "fornecedor": fornecedor,
                    "valor": valor,
                    "origem": origem,
                }
            )

    estrutura = [r for r in records if r["origem"].startswith("3=Despesa")]
    producao = [r for r in records if r["origem"].startswith("2=Produção")]

    structure_ytd = sum(r["valor"] for r in estrutura if r["date"] <= base_date)
    structure_mtd = sum(r["valor"] for r in estrutura if r["date"].year == base_date.year and r["date"].month == base_date.month and r["date"] <= base_date)
    production_mtd = sum(r["valor"] for r in producao if r["date"].year == base_date.year and r["date"].month == base_date.month and r["date"] <= base_date)
    structure_run_rate = structure_mtd / base_date.day * 30 if base_date.day else 0.0

    bucket_totals = defaultdict(float)
    for r in estrutura:
        if r["date"].year == base_date.year and r["date"].month == base_date.month and r["date"] <= base_date:
            bucket_totals[categorize_vendor(r["fornecedor"])] += r["valor"]

    notes = {
        "Outros estrutura": "Viagens, fornecedores externos e itens não recorrentes.",
        "Sócios/retiradas": "Principal alavanca imediata de caixa.",
        "Bancos e tarifas": "Consórcios, banco e encargos financeiros.",
        "Infraestrutura": "Administração, limpeza, software e escritório.",
        "Diversos discricionários": "Refeições, mercado, mobilidade e consumo.",
        "Benefícios e saúde": "Caju, Omint, telefonia e correlatos.",
        "Folha e equipe fixa": "Equipe fixa e pagamentos recorrentes da estrutura.",
    }
    month_buckets = []
    for name, value in sorted(bucket_totals.items(), key=lambda item: item[1], reverse=True)[:6]:
        month_buckets.append({"name": name, "value": round(value, 2), "note": notes.get(name, "Categoria consolidada automaticamente.")})

    controllable_categories = {"Sócios/retiradas", "Bancos e tarifas", "Diversos discricionários"}
    controllable_mtd = sum(bucket_totals.get(cat, 0.0) for cat in controllable_categories)
    controllable_share = controllable_mtd / structure_mtd if structure_mtd else 0.0

    top_opportunities = [
        f"Travar retiradas dos sócios: {bucket_totals.get('Sócios/retiradas', 0.0):,.2f} no mês-base.",
        f"Podar gastos discricionários: {bucket_totals.get('Diversos discricionários', 0.0):,.2f} no mês-base.",
        f"Renegociar bancos/tarifas e serviços: {bucket_totals.get('Bancos e tarifas', 0.0):,.2f} no mês-base.",
    ]

    return {
        "structure_ytd": round(structure_ytd, 2),
        "structure_mtd": round(structure_mtd, 2),
        "structure_run_rate": round(structure_run_rate, 2),
        "production_mtd": round(production_mtd, 2),
        "controllable_mtd": round(controllable_mtd, 2),
        "controllable_share": round(controllable_share, 4),
        "april_buckets": month_buckets,
        "top_opportunities": top_opportunities,
        "reduction_goal": round(min(max(controllable_mtd * 0.68, 150000.0), controllable_mtd), 2) if controllable_mtd else 150000.0,
    }


def parse_cash_excel(path: Path, preferred_date: date | None = None) -> dict:
    wb = parse_xlsx(path)
    best_score = -1
    best_rows = None
    best_dates = None

    for _sheet, rows in wb.items():
        date_cols: dict[int, date] = {}
        row_values: dict[str, dict[date, float]] = defaultdict(dict)

        for row in rows[:2]:
            for idx, cell in enumerate(row):
                dt = parse_date_from_text(cell)
                if not dt:
                    dt = parse_excel_serial_date(cell)
                if dt:
                    date_cols[idx] = dt

        if not date_cols:
            continue

        for row in rows:
            label = " ".join(s(cell) for cell in row[:3] if s(cell))
            if not label:
                continue
            key = detect_cash_row_key(label)
            if not key:
                continue
            for idx, dt in date_cols.items():
                if idx < len(row):
                    row_values[key][dt] = f(row[idx])

        score = len(date_cols) + len(row_values) * 3
        if score > best_score:
            best_score = score
            best_rows = row_values
            best_dates = sorted(set(date_cols.values()))

    flow_rows, flow_dates = parse_cash_flow_layout(wb)
    primary_balance_score = value_score(best_rows.get("ending_balance", {}) if best_rows else {})
    flow_balance_score = value_score(flow_rows.get("ending_balance", {}) if flow_rows else {})

    if flow_balance_score > primary_balance_score:
        best_rows, best_dates = flow_rows, flow_dates
    elif (not best_rows or not best_dates) or all(not values for values in best_rows.values()):
        best_rows, best_dates = flow_rows, flow_dates

    if not best_rows or not best_dates:
        raise SystemExit(f"Unable to parse cash workbook: {path}")

    base_date = preferred_date or best_dates[-1]
    if base_date not in best_dates:
        candidates = [dt for dt in best_dates if dt <= base_date]
        base_date = candidates[-1] if candidates else best_dates[-1]

    relevant_dates = [dt for dt in best_dates if dt <= base_date][-3:]

    summary_lookup = {
        "cash_now": "ending_balance",
        "cash_accumulated_ytd": "cash_accumulated_ytd",
        "receivable": "receivable",
        "to_invoice": "to_invoice",
        "anticipated": "anticipated",
        "company_loans": "company_loans",
    }
    summary = {
        out_key: round(best_rows.get(src_key, {}).get(base_date, 0.0), 2)
        for out_key, src_key in summary_lookup.items()
    }

    daily_snapshot = {}
    for dt in relevant_dates:
        daily_snapshot[dt.isoformat()] = {
            "opening_balance": round(best_rows.get("opening_balance", {}).get(dt, 0.0), 2),
            "receipts": round(best_rows.get("receipts", {}).get(dt, 0.0), 2),
            "payments": round(best_rows.get("payments", {}).get(dt, 0.0), 2),
            "ending_balance": round(best_rows.get("ending_balance", {}).get(dt, 0.0), 2),
        }

    return {
        "meta": {
            "base_date": base_date.isoformat(),
            "note": f"Snapshot gerado automaticamente a partir da planilha de caixa: {path.name}",
        },
        "daily_snapshot": daily_snapshot,
        "summary": summary,
    }


def value_score(values: dict[date, float]) -> float:
    return sum(abs(v) for v in values.values())


def parse_cash_flow_layout(wb: dict[str, list[list[str]]]) -> tuple[dict[str, dict[date, float]], list[date]]:
    best_rows = None
    best_dates = None
    best_score = -1

    for _sheet, rows in wb.items():
        date_cols: dict[int, date] = {}
        for row in rows[:4]:
            for idx, cell in enumerate(row):
                dt = parse_date_from_text(cell)
                if not dt:
                    dt = parse_excel_serial_date(cell)
                if dt:
                    date_cols[idx] = dt

        if not date_cols:
            continue

        row_values: dict[str, dict[date, float]] = defaultdict(dict)

        for row in rows:
            label = normalize_text(" ".join(s(cell) for cell in row[:2] if s(cell)))
            if not label:
                continue

            if "saldo" == label:
                key = "ending_balance"
            elif "total contas a receber" in label:
                key = "receipts"
                row_values["receivable"] = {}
            elif "total d e s p e s a s" in label or "total despesas" in label:
                key = "payments"
            else:
                continue

            for idx, dt in date_cols.items():
                if idx >= len(row):
                    continue
                value = f(row[idx])
                row_values[key][dt] = value
                if key == "receipts":
                    row_values["receivable"][dt] = value

        ending = row_values.get("ending_balance", {})
        if ending:
            sorted_dates = sorted(date_cols.values())
            for pos, dt in enumerate(sorted_dates):
                if pos == 0:
                    row_values["opening_balance"][dt] = 0.0
                else:
                    prev_dt = sorted_dates[pos - 1]
                    row_values["opening_balance"][dt] = ending.get(prev_dt, 0.0)

        score = len(date_cols) + sum(bool(row_values.get(k)) for k in ["ending_balance", "receipts", "payments"]) * 5
        if score > best_score:
            best_score = score
            best_rows = row_values
            best_dates = sorted(set(date_cols.values()))

    return best_rows, best_dates


def load_cash_snapshot(cash_json_path: Path, cash_excel_path: Path, preferred_date: date | None = None) -> tuple[dict, str]:
    if cash_excel_path.exists():
        excel_snapshot = parse_cash_excel(cash_excel_path, preferred_date)
        if cash_json_path.exists():
            try:
                json_snapshot = json.loads(cash_json_path.read_text())
                return merge_cash_snapshots(json_snapshot, excel_snapshot), "excel"
            except Exception:
                return excel_snapshot, "excel"
        return excel_snapshot, "excel"
    if cash_json_path.exists():
        return json.loads(cash_json_path.read_text()), "json"
    raise SystemExit("Neither cash Excel nor cash JSON snapshot was found.")


def merge_cash_snapshots(base_snapshot: dict, fresh_snapshot: dict) -> dict:
    merged = json.loads(json.dumps(base_snapshot))
    merged["meta"] = fresh_snapshot.get("meta", merged.get("meta", {}))

    for dt, values in fresh_snapshot.get("daily_snapshot", {}).items():
        merged.setdefault("daily_snapshot", {})[dt] = values

    base_summary = merged.setdefault("summary", {})
    for key, value in fresh_snapshot.get("summary", {}).items():
        if value not in (0, 0.0, "", None):
            base_summary[key] = value

    return merged


def build_generated_input(template_path: Path, expenses_path: Path, cash: dict, cash_source: str) -> dict:
    base_date = datetime.strptime(cash["meta"]["base_date"], "%Y-%m-%d").date()
    expense_metrics = parse_expenses(expenses_path, base_date)
    summary = cash["summary"]

    generated = {
        "meta": {
            "title": "Board Integrado Financeiro e Despesas",
            "subtitle": "Atualização executiva para gestão e conselho",
            "base_date": cash["meta"]["base_date"],
            "company": "Lampada",
            "template_pptx": str(template_path),
            "cash_source": cash_source,
        },
        "financial": {
            "cash_now": summary["cash_now"],
            "cash_label": f"Saldo final c/c projetado em {base_date.strftime('%d/%m/%Y')}",
            "cash_accumulated_ytd": summary["cash_accumulated_ytd"],
            "cash_accumulated_label": "Acumulado de 2026",
            "receivable": summary["receivable"],
            "receivable_label": "A receber",
            "to_invoice": summary["to_invoice"],
            "to_invoice_label": "Previsto a faturar",
            "anticipated": summary["anticipated"],
            "anticipated_label": "Antecipados",
            "company_loans": summary.get("company_loans", 0.0),
            "company_loans_label": "Empréstimo CP",
            "critical_points": [
                "O problema atual é liquidez de curtíssimo prazo, não ausência de carteira.",
                f"O caixa imediato está em {summary['cash_now']:,.2f} e o acumulado do ano em {summary['cash_accumulated_ytd']:,.2f}.",
                "A virada depende de cobrança, faturamento e contenção das saídas controláveis.",
            ],
            "actions": [
                "Emitir e cobrar os títulos mais próximos de liquidação.",
                "Segurar retiradas e despesas discricionárias até o caixa voltar ao positivo.",
                "Renegociar vencimentos relevantes de fornecedores para alongar o vale de caixa.",
            ],
        },
        "expenses": expense_metrics,
        "narrative": {
            "summary": [
                "A empresa tem carteira para recuperar caixa, mas precisa de disciplina tática no curto prazo.",
                "A estrutura do mês segue pesada e há espaço real para reduzir saídas controláveis.",
                "O board integrado deve ser acompanhado com ritual frequente até estabilização financeira.",
            ],
            "board_decisions": [
                "Criar rotina diária de caixa até o saldo voltar ao positivo.",
                "Aprovar trava temporária para retiradas e despesas fora do core.",
                "Revisar semanalmente faturamento, cobrança, despesas e saldo mínimo.",
            ],
        },
    }
    return generated


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera o board integrado automaticamente a partir das planilhas e do snapshot de caixa.")
    parser.add_argument("--template", default=str(DEFAULT_TEMPLATE), help="Template PPTX base.")
    parser.add_argument("--expenses", default=str(DEFAULT_EXPENSES), help="Planilha de despesas.")
    parser.add_argument("--cash", default=str(DEFAULT_CASH_JSON), help="Arquivo JSON com snapshot de caixa.")
    parser.add_argument("--cash-excel", default=str(DEFAULT_CASH_EXCEL), help="Planilha de caixa. Se existir, ela tem prioridade sobre o JSON.")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), help="PPTX de saída.")
    parser.add_argument("--generated-input", default=str(DEFAULT_OUTPUT_INPUT), help="JSON gerado com os dados consolidados.")
    parser.add_argument("--generated-cash", default=str(DEFAULT_GENERATED_CASH), help="Snapshot de caixa gerado pelo processo.")
    parser.add_argument("--desktop-copy", action="store_true", help="Também copia o PPTX para a Desktop.")
    args = parser.parse_args()

    template_path = Path(args.template)
    expenses_path = Path(args.expenses)
    cash_json_path = Path(args.cash)
    cash_excel_path = Path(args.cash_excel)
    output_path = Path(args.output)
    generated_input_path = Path(args.generated_input)
    generated_cash_path = Path(args.generated_cash)

    if not template_path.exists():
        raise SystemExit(f"Template not found: {template_path}")
    if not expenses_path.exists():
        raise SystemExit(f"Expenses workbook not found: {expenses_path}")

    preferred_date = None
    if cash_json_path.exists():
        try:
            preferred_date = datetime.strptime(json.loads(cash_json_path.read_text())["meta"]["base_date"], "%Y-%m-%d").date()
        except Exception:
            preferred_date = None

    cash_snapshot, cash_source = load_cash_snapshot(cash_json_path, cash_excel_path, preferred_date)
    generated_cash_path.write_text(json.dumps(cash_snapshot, ensure_ascii=False, indent=2))

    generated = build_generated_input(template_path, expenses_path, cash_snapshot, cash_source)
    generated_input_path.write_text(json.dumps(generated, ensure_ascii=False, indent=2))

    slides = build_slides(generated)
    build_deck(template_path, output_path, slides)
    print(output_path)
    print(generated_input_path)
    print(generated_cash_path)

    if args.desktop_copy:
        DEFAULT_DESKTOP.write_bytes(output_path.read_bytes())
        print(DEFAULT_DESKTOP)


if __name__ == "__main__":
    main()
