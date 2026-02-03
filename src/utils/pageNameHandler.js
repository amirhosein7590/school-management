import pageNames from "@/constants/pageNames";

export default function pageNameHandler(pageNameKey, pageName = "") {
  const page = pageNames[pageNameKey];
  if (pageName) {
    document.title = pageName;
  } else {
    document.title = page;
  }
}
