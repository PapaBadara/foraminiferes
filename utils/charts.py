"""
Fonctions de visualisation partagées.
"""
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

PALETTE = {
    "1998 – Falaise de Popenguine": "#E07B54",
    "2000 – Toubab Dialaw": "#5B8DB8",
    "2009 – Lac Retba": "#4CAF7D",
}

MAP_STYLE = "carto-positron"


def chart_type_distribution(df: pd.DataFrame) -> go.Figure:
    counts = df["Type"].value_counts().reset_index()
    counts.columns = ["Type", "Nombre"]
    fig = px.pie(
        counts,
        names="Type",
        values="Nombre",
        color_discrete_sequence=["#5B8DB8", "#E07B54", "#4CAF7D"],
        hole=0.4,
    )
    fig.update_traces(textinfo="percent+label")
    fig.update_layout(showlegend=True, margin=dict(t=20, b=20))
    return fig


def chart_ordre_bar(df: pd.DataFrame) -> go.Figure:
    counts = df["Groupe/Ordre"].value_counts().nlargest(10).reset_index()
    counts.columns = ["Ordre", "Nombre"]
    fig = px.bar(
        counts,
        x="Nombre",
        y="Ordre",
        orientation="h",
        color="Nombre",
        color_continuous_scale="Blues",
    )
    fig.update_layout(
        yaxis=dict(autorange="reversed"),
        coloraxis_showscale=False,
        margin=dict(t=10, b=10),
        height=320,
    )
    return fig


def chart_source_sunburst(df: pd.DataFrame) -> go.Figure:
    fig = px.sunburst(
        df,
        path=["Source", "Classe", "Type"],
        color="Source",
        color_discrete_map=PALETTE,
    )
    fig.update_layout(margin=dict(t=20, b=20))
    return fig


def chart_age_timeline(df: pd.DataFrame) -> go.Figure:
    age_src = df.groupby(["Age_géologique", "Source"]).size().reset_index(name="n")
    fig = px.bar(
        age_src,
        x="Age_géologique",
        y="n",
        color="Source",
        color_discrete_map=PALETTE,
        barmode="stack",
    )
    fig.update_layout(
        xaxis_tickangle=-35,
        margin=dict(t=10, b=60),
        height=340,
        legend=dict(orientation="h", yanchor="bottom", y=1.02),
    )
    return fig


def map_decouvertes(df: pd.DataFrame) -> go.Figure:
    geo = df.dropna(subset=["latitude", "longitude"]).copy()
    geo["latitude"] = pd.to_numeric(geo["latitude"], errors="coerce")
    geo["longitude"] = pd.to_numeric(geo["longitude"], errors="coerce")
    geo = geo.dropna(subset=["latitude", "longitude"])

    fig = px.scatter_mapbox(
        geo,
        lat="latitude",
        lon="longitude",
        color="Source",
        color_discrete_map=PALETTE,
        hover_name="Nom_taxon",
        hover_data={
            "Type": True,
            "Age_géologique": True,
            "Lieu_découverte": True,
            "latitude": False,
            "longitude": False,
        },
        size_max=18,
        zoom=7,
        center={"lat": 14.65, "lon": -17.15},
        mapbox_style=MAP_STYLE,
        height=540,
    )
    fig.update_traces(marker=dict(size=14, opacity=0.85))
    fig.update_layout(
        margin=dict(t=0, b=0, l=0, r=0),
        legend=dict(
            title="Source",
            bgcolor="rgba(255,255,255,0.85)",
            bordercolor="#ccc",
            borderwidth=1,
        ),
    )
    return fig
