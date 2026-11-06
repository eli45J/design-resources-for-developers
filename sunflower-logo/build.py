"""Generates the SUNFLOWER logo family as pure vector SVG.

All letterforms are custom-drawn geometric shapes (no font dependency),
so the SVGs render identically everywhere and can be sent to print as-is.
Run:  python3 build.py   -> writes ./svg/*.svg
"""
import math, os

YELLOW = "#FFD400"
BLACK = "#111111"
RED = "#E63323"
WHITE = "#FFFFFF"

def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")

def poly(pts):
    return "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts) + " Z"

def rect(x, y, w, h):
    return poly([(x, y), (x + w, y), (x + w, y + h), (x, y + h)])

def diag(xt, xb, dx, y0=0, y1=100):
    """Parallelogram stroke: top edge [xt, xt+dx] at y0, bottom [xb, xb+dx] at y1."""
    return poly([(xt, y0), (xt + dx, y0), (xb + dx, y1), (xb, y1)])

def dxw(t, run, rise=100):
    """Horizontal width of a diagonal stroke with perpendicular thickness t."""
    return t * math.hypot(run, rise) / rise

# ---------------------------------------------------------------- glyphs
# Each glyph returns (advance_width, fills[], strokes[]) in a 100-unit cap height.
# fills: path data filled; strokes: centerline path data drawn with stroke-width t.

def g_S(t, W=None):
    W = W or 70 + t * 0.1
    h = t / 2
    r = (100 - t) / 4
    cl = W - h - r
    d = (f"M{f(W - 3)},{f(h)} H{f(h + r)} A{f(r)},{f(r)} 0 0 0 {f(h + r)},50 "
         f"H{f(cl)} A{f(r)},{f(r)} 0 0 1 {f(cl)},{f(100 - h)} H3")
    return W, [], [d]

def g_U(t, W=None):
    W = W or 72
    h = t / 2
    R = (W - t) / 2
    d = f"M{f(h)},0 V{f(100 - h - R)} A{f(R)},{f(R)} 0 0 0 {f(W - h)},{f(100 - h - R)} V0"
    return W, [], [d]

def g_N(t, W=None):
    W = W or 76
    dx = dxw(t, W - t, 100) * 0.92
    return W, [rect(0, 0, t, 100), rect(W - t, 0, t, 100), diag(0, W - dx, dx)], []

def g_F(t, W=None):
    W = W or 58
    return W, [rect(0, 0, t, 100), rect(0, 0, W, t), rect(0, 50 - t / 2 + 2, W - 6, t)], []

def g_E(t, W=None):
    W = W or 60
    return W, [rect(0, 0, t, 100), rect(0, 0, W, t), rect(0, 50 - t / 2, W - 5, t),
               rect(0, 100 - t, W, t)], []

def g_L(t, W=None):
    W = W or 56
    return W, [rect(0, 0, t, 100), rect(0, 100 - t, W, t)], []

def g_I(t, W=None):
    return t, [rect(0, 0, t, 100)], []

def g_W(t, W=None):
    W = W or 118
    b1 = W * 0.27
    dx = dxw(t, b1, 100) * 0.95
    m = W / 2 - dx / 2
    B1 = b1 - dx / 2
    B2 = W - b1 - dx / 2
    return W, [diag(0, B1, dx), diag(m, B1, dx), diag(m, B2, dx), diag(W - dx, B2, dx)], []

def g_Z(t, W=None):
    W = W or 62
    dx = dxw(t, W, 100 - 2 * t) * 0.95
    return W, [rect(0, 0, W, t), rect(0, 100 - t, W, t),
               diag(W - dx, 0, dx, t - 0.5, 100 - t + 0.5)], []

def g_A(t, W=None):
    W = W or 78
    top = t * 1.05                     # flat apex width
    L = W / 2 - top / 2
    dx = dxw(t, L, 100)
    # outer silhouette
    outer = poly([(0, 100), (L, 0), (W - L, 0), (W, 100)])
    # inner edges: x_in(y) = L*(100-y)/100 + dx  meets W/2 at apex
    def xin(y):
        return L * (100 - y) / 100 + dx
    ya = 100 - (W / 2 - dx) * 100 / L          # apex of counter
    c1, c2 = 58, 58 + t * 0.85                 # crossbar
    counter = poly([(W / 2, ya), (W - xin(c1), c1), (xin(c1), c1)])
    notch = poly([(xin(c2), c2), (W - xin(c2), c2), (W - xin(100), 100), (xin(100), 100)])
    return W, [outer + " " + counter + " " + notch], []

def _bowl(t, x0, y_top, y_bot, xr):
    """Centerline of a D-shaped bowl attached to a stem at x0."""
    h = t / 2
    r = (y_bot - y_top) / 2
    return (f"M{f(x0)},{f(y_top)} H{f(xr - h - r)} A{f(r)},{f(r)} 0 0 1 "
            f"{f(xr - h - r)},{f(y_bot)} H{f(x0)}")

def g_P(t, W=None):
    W = W or 66
    h = t / 2
    return W, [rect(0, 0, t, 100)], [_bowl(t, h, h, 60 - h, W)]

def g_R(t, W=None):
    W = W or 70
    h = t / 2
    yb = 64 - h
    dx = dxw(t, W * 0.45, 100 - yb)
    leg = poly([(W * 0.36, yb - h), (W * 0.36 + dx, yb - h), (W, 100), (W - dx, 100)])
    return W, [rect(0, 0, t, 100), leg], [_bowl(t, h, h, yb, W)]

def g_B(t, W=None):
    W = W or 66
    h = t / 2
    mid = 48
    return W, [rect(0, 0, t, 100)], [_bowl(t, h, h, mid, W - 5), _bowl(t, h, mid, 100 - h, W)]

def g_D(t, W=None):
    W = W or 74
    h = t / 2
    R = (100 - t) / 2 * 0.8
    d = (f"M{f(h)},{f(h)} H{f(W - h - R)} A{f(R)},{f(R)} 0 0 1 {f(W - h)},{f(h + R)} "
         f"V{f(100 - h - R)} A{f(R)},{f(R)} 0 0 1 {f(W - h - R)},{f(100 - h)} H{f(h)}")
    return W, [rect(0, 0, t, 100)], [d]

def g_G(t, W=None):
    W = W or 82
    h = t / 2
    cx, cy = W / 2, 50
    rx, ry = W / 2 - h, 50 - h
    a = math.radians(-38)
    sx, sy = cx + rx * math.cos(a), cy + ry * math.sin(a)
    d = (f"M{f(sx)},{f(sy)} A{f(rx)},{f(ry)} 0 1 0 {f(W - h)},{f(cy + 4)}")
    bar = rect(W / 2 + 2, cy + 4 - h, W / 2 - 2, t)
    stub = rect(W - t, cy + 4 - h, t, 100 - (cy + 4 - h) - 18)
    return W, [bar], [d + f" V{f(cy + 4)}"]

def g_O(t, W=None):
    W = W or 84
    h = t / 2
    d = (f"M{f(W / 2)},{f(h)} A{f(W / 2 - h)},{f(50 - h)} 0 1 1 {f(W / 2 - 0.01)},{f(h)} Z")
    return W, [], [d]

def g_Ouml(t, W=None):
    W, fills, strokes = g_O(t, W)
    r = t * 0.62
    dots = [f"M{f(x - r)},-22 a{f(r)},{f(r)} 0 1 0 {f(2 * r)},0 a{f(r)},{f(r)} 0 1 0 {f(-2 * r)},0 Z"
            for x in (W * 0.32, W * 0.68)]
    return W, fills + dots, strokes

GLYPHS = dict(S=g_S, U=g_U, N=g_N, F=g_F, E=g_E, L=g_L, I=g_I, W=g_W, Z=g_Z, A=g_A,
              P=g_P, R=g_R, B=g_B, D=g_D, G=g_G, O=g_O, Ö=g_Ouml)

def set_text(text, t, x0=0, y0=0, size=100, track=6, color=BLACK, sep_color=RED, sep_r=None):
    """Lay out text; returns (svg_group, width). '•' becomes a dot in sep_color."""
    s = size / 100
    x = 0
    parts = []
    for ch in text:
        if ch == " ":
            x += 26
            continue
        if ch == "•":
            r = sep_r or t * 0.8
            parts.append(f'<circle cx="{f(x + r)}" cy="50" r="{f(r)}" fill="{sep_color}"/>')
            x += 2 * r + track
            continue
        w, fills, strokes = GLYPHS[ch](t)
        g = [f'<path d="{d}" fill="{color}" fill-rule="evenodd"/>' for d in fills]
        g += [f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{f(t)}"/>' for d in strokes]
        parts.append(f'<g transform="translate({f(x)},0)">{"".join(g)}</g>')
        x += w + track
    x -= track
    grp = f'<g transform="translate({f(x0)},{f(y0)}) scale({f(s)})">{"".join(parts)}</g>'
    return grp, x * s

# ---------------------------------------------------------------- sunflower / pizza icon
def sunflower(cx, cy, R, mode="color", bg=None, ring=None):
    """The 'O': black disc, ring of yellow petals, pizza center.
    mode: color | mono (single colour, petals knocked out) | mono-light (for dark backgrounds)"""
    n = 13
    r_in, r_out, wid = R * 0.47, R * 0.88, R * 0.235
    petals = []
    for i in range(n):
        a = 2 * math.pi * i / n - math.pi / 2
        ca, sa = math.cos(a), math.sin(a)
        def P(u, v):  # local (radial u, tangential v)
            return cx + u * ca - v * sa, cy + u * sa + v * ca
        p0, p1 = P(r_in, 0), P(r_out, 0)
        c1, c2 = P(r_in + (r_out - r_in) * 0.42, wid), P(r_in + (r_out - r_in) * 0.42, -wid)
        k1, k2 = P(r_out - (r_out - r_in) * 0.18, wid * 0.62), P(r_out - (r_out - r_in) * 0.18, -wid * 0.62)
        petals.append(f"M{f(p0[0])},{f(p0[1])} C{f(c1[0])},{f(c1[1])} {f(k1[0])},{f(k1[1])} {f(p1[0])},{f(p1[1])} "
                      f"C{f(k2[0])},{f(k2[1])} {f(c2[0])},{f(c2[1])} {f(p0[0])},{f(p0[1])} Z")
    petals_d = " ".join(petals)
    def circ(x, y, r):
        return f"M{f(x - r)},{f(y)} a{f(r)},{f(r)} 0 1 0 {f(2 * r)},0 a{f(r)},{f(r)} 0 1 0 {f(-2 * r)},0 Z"
    crust_r, sauce_r = R * 0.40, R * 0.315
    # toppings / seeds: golden-angle (sunflower) distribution
    dots = []
    ga = math.pi * (3 - math.sqrt(5))
    nd = 9
    for i in range(nd):
        rr = sauce_r * 0.78 * math.sqrt((i + 0.6) / nd)
        a = i * ga + 0.4
        dots.append(circ(cx + rr * math.cos(a), cy + rr * math.sin(a), R * 0.045))
    dots_d = " ".join(dots)
    halo = (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R + R * 0.06)}" fill="{ring}"/>' if ring else "")
    if mode == "color":
        return halo + (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}" fill="{BLACK}"/>'
                f'<path d="{petals_d}" fill="{YELLOW}"/>'
                f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(crust_r)}" fill="{YELLOW}"/>'
                f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(sauce_r)}" fill="{RED}"/>'
                f'<path d="{dots_d}" fill="{YELLOW}"/>')
    ink = BLACK if mode == "mono" else WHITE
    # single colour: disc with petals + crust ring knocked out, sauce solid, dots knocked out
    ring = circ(cx, cy, crust_r) + " " + circ(cx, cy, sauce_r)
    d = circ(cx, cy, R) + " " + petals_d + " " + ring + " " + dots_d
    return f'<path d="{d}" fill="{ink}" fill-rule="evenodd"/>'

# ---------------------------------------------------------------- compositions
T_MAIN = 27
T_TAG = 15

def wordmark(mode="color", ink=BLACK, tag=True, tag_ink=None, bullet=RED, pad=24, bg=None, ring=None):
    """Horizontal logo. Returns (svg_body, width, height)."""
    parts = []
    x = 0
    track = 7
    R = 58  # sunflower radius (cap height 100 -> overshoots like a real 'O')
    for i, ch in enumerate("SUNFLOWER"):
        if ch == "O":
            cx = x + R
            parts.append(sunflower(cx, 50, R, mode, bg, ring))
            x += 2 * R + track
            continue
        grp, w = set_text(ch, T_MAIN, x0=x, color=ink)
        parts.append(grp)
        x += w + track
    width = x - track
    height = 50 + R
    if tag:
        size = 21
        g, tw = set_text("DÖNER • PIZZA • BURGER", T_TAG, size=size, track=13, color=tag_ink or ink,
                         sep_color=bullet, sep_r=13)
        y = 50 + R + 22
        g2, _ = set_text("DÖNER • PIZZA • BURGER", T_TAG, x0=(width - tw) / 2, y0=y, size=size, track=13,
                         color=tag_ink or ink, sep_color=bullet, sep_r=13)
        parts.append(g2)
        height = y + size
    top = 50 - R
    body = "".join(parts)
    vb = (-pad, top - pad, width + 2 * pad, height - top + 2 * pad)
    return body, vb

def svg(body, vb, bg=None, title="SUNFLOWER logo"):
    x, y, w, h = vb
    bgrect = f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x)} {f(y)} {f(w)} {f(h)}" '
            f'width="{f(w * 2)}" height="{f(h * 2)}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{bgrect}{body}</svg>\n')

def icon(mode="color", bg=YELLOW, round_=False, size=240):
    c = size / 2
    R = size * 0.36
    back = (f'<circle cx="{c}" cy="{c}" r="{c}" fill="{bg}"/>' if round_
            else f'<rect width="{size}" height="{size}" fill="{bg}"/>') if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size * 4}" '
            f'height="{size * 4}" role="img" aria-label="SUNFLOWER icon"><title>SUNFLOWER icon</title>'
            f'{back}{sunflower(c, c, R, mode, bg)}</svg>\n')

def stacked(ink=BLACK, mode="color", bg=None, bullet=RED):
    R = 92
    body = [sunflower(0, 0, R, mode, bg)]
    g, w = set_text("SUNFLOWER", T_MAIN, size=56, track=7, color=ink)
    # re-set centred
    g, w = set_text("SUNFLOWER", T_MAIN, x0=-w / 2, y0=R + 30, size=56, track=7, color=ink)
    body.append(g)
    g, tw = set_text("DÖNER • PIZZA • BURGER", T_TAG, size=15, track=13, sep_r=13)
    g, tw = set_text("DÖNER • PIZZA • BURGER", T_TAG, x0=-tw / 2, y0=R + 30 + 56 + 22, size=15,
                     track=13, color=ink, sep_color=bullet, sep_r=13)
    body.append(g)
    pad = 30
    half = max(w, 2 * R) / 2
    vb = (-half - pad, -R - pad, 2 * half + 2 * pad, R + 30 + 56 + 22 + 15 + R + 2 * pad)
    return "".join(body), vb

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg")
    os.makedirs(out, exist_ok=True)
    files = {
        "sunflower-logo.svg": svg(*wordmark()),
        "sunflower-logo-on-yellow.svg": svg(*wordmark(), bg=YELLOW),
        "sunflower-logo-on-black.svg": svg(*wordmark(ink=WHITE, bullet=YELLOW, ring=YELLOW), bg=BLACK),
        "sunflower-logo-black.svg": svg(*wordmark(mode="mono", bullet=BLACK)),
        "sunflower-logo-white.svg": svg(*wordmark(mode="mono-light", ink=WHITE, bullet=WHITE, bg=BLACK), bg=BLACK),
        "sunflower-wordmark.svg": svg(*wordmark(tag=False)),
        "sunflower-stacked.svg": svg(*stacked()),
        "sunflower-stacked-on-yellow.svg": svg(*stacked(), bg=YELLOW),
        "sunflower-icon.svg": icon(bg=None),
        "sunflower-icon-yellow.svg": icon(bg=YELLOW),
        "sunflower-icon-profile.svg": icon(bg=YELLOW, round_=True),
        "sunflower-icon-black.svg": icon(mode="mono", bg=None),
    }
    for name, data in files.items():
        with open(os.path.join(out, name), "w") as fh:
            fh.write(data)
    print("wrote", len(files), "files to", out)
