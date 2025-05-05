import BestSupportIcon from "@icons/BestSupportIcon";
import BestCoreIcon from "@icons/BestCoreIcon";
import BestPlayerIcon from "@icons/BestPlayerIcon";
import Pos1Icon from "@icons/Pos1Icon";
import Pos2Icon from "@icons/Pos2Icon";
import Pos3Icon from "@icons/Pos3Icon";
import Pos4Icon from "@icons/Pos4Icon";
import Pos5Icon from "@icons/Pos5Icon";

export const getRoleInfo = (position) => {
  switch (position) {
    case "POSITION_1":
      return { icon: <Pos1Icon size={20} />, name: "Carry" };
    case "POSITION_2":
      return { icon: <Pos2Icon size={20} />, name: "Mid" };
    case "POSITION_3":
      return { icon: <Pos3Icon size={20} />, name: "Off" };
    case "POSITION_4":
      return { icon: <Pos4Icon size={20} />, name: "Pos 4" };
    case "POSITION_5":
      return { icon: <Pos5Icon size={20} />, name: "Pos 5" };
    default:
      return { icon: null, name: "?" };
  }
};

export const getAwardIcon = (award) => {
  switch (award) {
    case "MVP":
      return <BestPlayerIcon size={25} />;
    case "TOP_CORE":
      return <BestCoreIcon size={25} />;
    case "TOP_SUPPORT":
      return <BestSupportIcon size={25} />;
    default:
      return null;
  }
};

export const getLabelStyle = (isRadiant) => ({
  backgroundColor: isRadiant ? "#587341" : "#823633",
  boxShadow: isRadiant ? "0 2px 5px #587341" : "0 4px 3px #823633",
});

export const getTeamStyle = (isRadiant) => ({
  backgroundColor: isRadiant ? "rgba(0,124,0,0.3)" : "rgba(219,0,0,0.3)",
});

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const gradientByTheme = {
  orange: "linear-gradient(180deg, #8A540C 0%, #FF9100 50%, #8A540C 100%)",
  // orange: "radial-gradient(  #FF9100 50%, #8A540C 75%)",
  purple: "linear-gradient(180deg, #441B2B 0%, #843856 50%, #441B2B 100%)",
  gray: "linear-gradient(90deg,rgb(165, 164, 164) 0%, #D9D9D9 50%, rgb(165, 164, 164) 100%)",
};

export const xpTable = [
  0, 230, 600, 1080, 1665, 2360, 3160, 4060, 5060, 6160, 7360, 8660, 10060,
  11560, 13160, 14860, 16660, 18560, 20560, 22660, 24860, 27160, 29560, 32060,
  34660, 37360, 40160, 43060, 46060,
];
