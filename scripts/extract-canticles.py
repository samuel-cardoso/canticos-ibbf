#!/usr/bin/env python3
"""
Gera src/data/canticos.json a partir dos .pptx de projeção dos cânticos.

Cada apresentação tem um slide de título e, depois, um slide por estrofe com o
cabeçalho "Título n/N" seguido das linhas da letra. O script lê os slides na ordem
da apresentação (presentation.xml, não a ordem dos arquivos), descarta título e
cabeçalhos e junta as estrofes com uma linha em branco.

Uso:
    python3 scripts/extract-canticles.py "~/Desktop/Cânticos refeitos"

Ids já existentes no JSON são preservados (casados pelo título); cânticos novos
recebem o próximo número livre. Só depende da biblioteca padrão do Python.
"""
import glob
import html
import json
import os
import re
import sys
import unicodedata
import zipfile

OUTPUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "canticos.json")


def nfc(value: str) -> str:
    return unicodedata.normalize("NFC", value)


def sort_key(title: str) -> str:
    return unicodedata.normalize("NFD", title).encode("ascii", "ignore").decode().lower()


def slide_paths(pptx: zipfile.ZipFile) -> list[str]:
    presentation = pptx.read("ppt/presentation.xml").decode()
    rels = pptx.read("ppt/_rels/presentation.xml.rels").decode()
    targets = {}
    for rel in re.findall(r"<Relationship [^>]*>", rels):
        rel_id = re.search(r'Id="([^"]+)"', rel)
        target = re.search(r'Target="([^"]+)"', rel)
        if rel_id and target:
            targets[rel_id.group(1)] = target.group(1)
    return ["ppt/" + targets[rel_id] for rel_id in re.findall(r'<p:sldId [^>]*r:id="([^"]+)"', presentation)]


def slide_lines(xml: str) -> list[str]:
    lines = []
    for paragraph in re.findall(r"<a:p(?:\s[^>]*)?>(.*?)</a:p>", xml, re.S):
        chunks = re.split(r"<a:br\s*/>", paragraph)
        for chunk in chunks:
            text = html.unescape("".join(re.findall(r"<a:t>(.*?)</a:t>", chunk)))
            text = re.sub(r"\s+", " ", text).strip()
            if text:
                lines.append(nfc(text))
    return lines


def extract(path: str) -> dict:
    title = nfc(os.path.splitext(os.path.basename(path))[0]).strip()
    pptx = zipfile.ZipFile(path)
    stanzas = []
    for index, slide in enumerate(slide_paths(pptx)):
        lines = slide_lines(pptx.read(slide).decode())
        if not lines:
            continue
        if re.match(r"^.*?\s*\d+\s*/\s*\d+$", lines[0]):
            lines = lines[1:]
        elif index == 0:
            continue  # slide de título
        else:
            print(f"aviso: '{title}' tem slide sem cabeçalho n/N: {lines[0][:50]!r}", file=sys.stderr)
        if lines:
            stanzas.append("\n".join(lines))
    if not stanzas:
        raise SystemExit(f"erro: '{title}' não tem letra")
    return {"title": title, "lyrics": "\n\n".join(stanzas)}


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    source = os.path.expanduser(sys.argv[1])
    files = glob.glob(os.path.join(source, "*.pptx"))
    canticles = sorted((extract(path) for path in files), key=lambda c: sort_key(c["title"]))

    existing = json.load(open(OUTPUT, encoding="utf8")) if os.path.exists(OUTPUT) else []
    id_by_title = {sort_key(c["title"]): c["id"] for c in existing}
    next_id = max(id_by_title.values(), default=0) + 1
    for canticle in canticles:
        key = sort_key(canticle["title"])
        if key not in id_by_title:
            id_by_title[key] = next_id
            next_id += 1
        canticle["id"] = id_by_title[key]

    output = [{"id": c["id"], "title": c["title"], "lyrics": c["lyrics"]} for c in sorted(canticles, key=lambda c: c["id"])]
    with open(OUTPUT, "w", encoding="utf8") as file:
        json.dump(output, file, ensure_ascii=False, indent=2)
        file.write("\n")
    print(f"{len(output)} cânticos gravados em {os.path.relpath(OUTPUT)}")


if __name__ == "__main__":
    main()
