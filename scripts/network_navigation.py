"""Read-only navigation checks for satellite apps and the card's own layout."""

from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit


class Navigation(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.links = set()
        self.network_script = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.add(urljoin(self.base_url, attrs["href"]))
        if tag == "script" and attrs.get("src"):
            path = urlsplit(urljoin(self.base_url, attrs["src"])).path
            self.network_script |= path.endswith("/asf-network.js")


def navigation_error(requested_url, final_url, body):
    """Return a diagnostic or None; callers still enforce HTTP 200 and HTTPS."""
    requested = urlsplit(requested_url)
    final = urlsplit(final_url)
    nav = Navigation(final_url)
    nav.feed(body)
    is_hub = requested.scheme == "https" and requested.netloc == "asf.surf"
    if is_hub and requested.path == "/emitir.html":
        if final.scheme != "https" or final.netloc != "asf.surf" or final.path != "/emitir.html":
            return "emissão redirecionada para destino inesperado"
        required = {
            "voltar ao app": {"https://asf.surf/", "https://asf.surf/index.html"},
            "recuperação": {"https://asf.surf/recuperar-carteirinha.html"},
            "benefícios": {"https://asf.surf/beneficios/"},
            "privacidade": {"https://asf.surf/privacidade.html"},
        }
        missing = [name for name, urls in required.items() if not urls & nav.links]
        return "navegação da carteirinha incompleta: " + ", ".join(missing) if missing else None
    # Retain only the exact historical hub exception, never a satellite fragment.
    if is_hub and requested.path in ("", "/", "/index.html") and requested.fragment == "carteirinha":
        return None
    return None if nav.network_script else "asf-network.js ausente"
