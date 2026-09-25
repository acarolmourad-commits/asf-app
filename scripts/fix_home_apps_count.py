#!/usr/bin/env python3
"""One-shot (25/09/2026): atualiza a contagem de apps satélites na home.

index.html e grande demais para edicao via API de conteudo, entao seguimos o
padrao do repo: script + workflow que commita a mudanca.
Idempotente: se nao houver '52 apps', nao faz nada.
"""
import sys

INDEX = "index.html"

def main():
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()

    novo = html.replace(
        "Todos os 52 apps gratuitos da rede de surf feminino",
        "Todos os 53 apps gratuitos da rede de surf feminino",
    )

    if novo == html:
        print("Nada a atualizar (contagem ja correta ou trecho ausente)")
        return

    if "52 apps" in novo:
        print("AVISO: ainda ha outras ocorrencias de '52 apps' — revisar")

    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(novo)
    print("OK: home atualizada para 53 apps satelites")

if __name__ == "__main__":
    main()
