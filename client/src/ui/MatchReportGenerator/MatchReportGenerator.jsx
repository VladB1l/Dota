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

    const formatPlayers = (players) => {
      return players.map((p) => {
        const name = p.steamAccount?.name || "Unknown";
        const hero = p.hero?.shortName || "UnknownHero";
        const rank = p.seasonRank ?? "N/A";
        const kda = `${p.kills}/${p.deaths}/${p.assists}`;
        const award = p.award !== "NONE" ? p.award : "-";
        const nw = p.computedNetworth ?? "—";
        const lvl = p.computedLevel ?? "—";
        const gpm = p.goldPerMinute ?? "—";
        const xpm = p.experiencePerMinute ?? "—";
        const hdmg = p.heroDamage ?? "—";
        const tdmg = p.towerDamage ?? "—";
        const heal = p.heroHealing ?? "—";

        return `- ${name} as ${hero} | Rank: ${rank} | K/D/A: ${kda} | Award: ${award} | NW: ${nw} | Lvl: ${lvl} | GPM: ${gpm} | XPM: ${xpm} | HDmg: ${hdmg} | TDmg: ${tdmg} | Heal: ${heal}`;
      });
    };

    const docContent = [
      { text: `Match Report: ${matchId}`, style: "header" },
      { text: `Winner: ${winner}`, style: "subheader" },

      { text: "\nPlayers:", style: "sectionHeader" },
      { text: "Radiant:", bold: true },
      ...formatPlayers(match.players.filter((p) => p.isRadiant)),
      { text: "Dire:", bold: true, margin: [0, 8, 0, 0] },
      ...formatPlayers(match.players.filter((p) => !p.isRadiant)),
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
        docContent.push({ text: `\n${data.title}:`, style: "sectionHeader" });
        docContent.push(
          ...data.content.map((line) => ({ text: line, margin: [0, 0, 0, 2] }))
        );
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

    pdfMake.createPdf(docDefinition).download(`match_${matchId}_report.pdf`);
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
