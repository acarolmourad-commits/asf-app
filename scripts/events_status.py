#!/usr/bin/env python3
"""
ASF Events Status - Hermes (controle temporal)
Atualiza o campo "status" de data/events.json com base nas datas reais.
Nunca inventa eventos; apenas classifica o que existe.
Estados: FUTURO -> PROXIMO (conforme spec) | EM_ANDAMENTO | ENCERRADO
Regra: em caso de data invalida, PRESERVA o status anterior e registra.
"""
import json
from datetime import date

PATH = "data/events.json"
TODAY = date.today().isoformat()

def classify(ev):
    try:
        ini = date.fromisoformat(ev["inicio"])
        fim = date.fromisoformat(ev.get("fim") or ev["inicio"])
    except Exception:
        return None  # data invalida -> duvida -> preservar
    hoje = date.today()
    if hoje < ini:
        return "PROXIMO"
    if ini <= hoje <= fim:
        return "EM_ANDAMENTO"
    return "ENCERRADO"

def main():
    with open(PATH, encoding="utf-8") as f:
        data = json.load(f)
    changed = False
    for ev in data.get("eventos", []):
        new = classify(ev)
        if new is None:
            print(f"PRESERVADO (data invalida): {ev.get('titulo')}")
            continue
        if ev.get("status") != new:
            print(f"{ev.get('titulo')}: {ev.get('status')} -> {new}")
            ev["status"] = new
            changed = True
    if changed:
        data["updated"] = TODAY
        with open(PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("events.json atualizado")
    else:
        print("Nada a atualizar")

if __name__ == "__main__":
    main()
