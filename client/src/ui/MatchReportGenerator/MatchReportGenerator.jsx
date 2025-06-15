import React from "react";
import UiButton from "@/ui/UiButton/UiButton";

const MatchReportGenerator = ({ match, analysis, optimization, refs }) => {
  if (!match || !analysis) return null;

  const generatePdf = async () => {
    const pdfMakeImport = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeImport.default || pdfMakeImport;
    const pdfFonts = await import("pdfmake/build/vfs_fonts");
    pdfMake.vfs = pdfFonts.default ? pdfFonts.default.vfs : pdfFonts.vfs;

    const matchId = match.id;
    const winner = match.didRadiantWin ? "Radiant" : "Dire";

    const formatPlayersTable = (players) => {
      return {
        table: {
          headerRows: 1,
          widths: [
            40,
            80,
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
            "auto",
          ],

          body: [
            [
              { text: "Name", bold: true },
              { text: "Hero", bold: true },
              { text: "Rank", bold: true },
              { text: "K/D/A", bold: true },
              { text: "NW", bold: true },
              { text: "Lvl", bold: true },
              { text: "GPM", bold: true },
              { text: "XPM", bold: true },
              { text: "HDmg", bold: true },
              { text: "TDmg", bold: true },
              { text: "Heal", bold: true },
            ],
            ...players.map((p) => [
              p.steamAccount?.name || "Unknown",
              p.hero?.shortName || "UnknownHero",
              p.seasonRank ?? "N/A",
              `${p.kills}/${p.deaths}/${p.assists}`,
              p.computedNetworth ?? "—",
              p.computedLevel ?? "—",
              p.goldPerMinute ?? "—",
              p.experiencePerMinute ?? "—",
              p.heroDamage ?? "—",
              p.towerDamage ?? "—",
              p.heroHealing ?? "—",
            ]),
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 4, 0, 8],
      };
    };

    const docContent = [
      { text: `Match Report: ${matchId}`, style: "header" },
      { text: `Winner: ${winner}`, style: "subheader" },

      { text: "\nPlayers:", style: "sectionHeader" },
      { text: "Radiant:", style: "subheader" },
      formatPlayersTable(match.players.filter((p) => p.isRadiant)),
      { text: "Dire:", style: "subheader", margin: [0, 8, 0, 0] },
      formatPlayersTable(match.players.filter((p) => !p.isRadiant)),
    ];

    const statsRefs = [
      refs?.runeStatsRef,
      refs?.stackStatsRef,
      refs?.wardStatsRef,
      refs?.laneStatsRef,
    ];

    for (const ref of statsRefs) {
      if (ref?.current?.getData) {
        const data = ref.current.getData();
        if (data.title === "Lane Stats") {
          docContent.push({ text: `\n${data.title}:`, style: "sectionHeader" });

          data.content.lanes.forEach((lane) => {
            docContent.push({
              text: `${lane.label} — Winner: ${lane.winner}`,
              style: "subheader",
            });

            docContent.push({
              table: {
                headerRows: 1,
                widths: [60, 60, "*", "*", "auto", "auto", "auto", "auto"],
                body: [
                  [
                    { text: "Lane", bold: true },
                    { text: "Team", bold: true },
                    { text: "Name", bold: true },
                    { text: "Hero", bold: true },
                    { text: "K/D/A", bold: true },
                    { text: "LH/DN", bold: true },
                    { text: "NW", bold: true },
                    { text: "Lvl", bold: true },
                  ],
                  ...lane.players.map((p) => [
                    lane.label,
                    p.team,
                    p.name,
                    p.hero,
                    p.kda,
                    p.lh_dn,
                    p.nw,
                    p.lvl,
                  ]),
                ],
              },
              layout: "lightHorizontalLines",
              margin: [0, 4, 0, 8],
            });

            docContent.push({
              text: `Summary: ${lane.summary}`,
              margin: [0, 0, 0, 12],
            });
          });

          docContent.push({
            text: `Overall Laning Summary:\n${data.content.overallSummary}`,
            margin: [0, 4, 0, 12],
          });
        }
      }
    }

    if (optimization) {
      docContent.push(
        { text: "\n\nOptimized Picks:", style: "sectionHeader" },
        {
          text: `Original Dire Winrate: ${optimization.direWinChanceOriginal}%`,
          bold: true,
        },
        {
          text: `Optimized Dire Winrate: ${optimization.direWinChanceOptimized}%`,
          bold: true,
        },
        {
          text: `Original Radiant Winrate: ${optimization.radiantWinChanceOriginal}%`,
          bold: true,
        },
        {
          text: `Optimized Radiant Winrate: ${optimization.radiantWinChanceOptimized}%`,
          bold: true,
        },
        { text: "Radiant Optimal Picks:", bold: true, margin: [0, 8, 0, 0] },
        ...optimization.optimizedRadiantDetails.map(
          (h) => `- ${h.displayName}`
        ),
        { text: "Dire Optimal Picks:", bold: true, margin: [0, 8, 0, 0] },
        ...optimization.optimizedDireDetails.map((h) => `- ${h.displayName}`)
      );
    }

    const docDefinition = {
      content: docContent,
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 12] },
        subheader: { fontSize: 16, margin: [0, 0, 0, 12] },
        sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 4] },
      },
    };

    pdfMake.createPdf(docDefinition).download(`Match ${matchId} report.pdf`);
  };

  return (
    <UiButton
      onClick={generatePdf}
      text="Download Match Report"
      className="mt-4"
    />
  );
};

export default MatchReportGenerator;
