import { useEffect, useRef, useState } from "react";
import data from "./data/links.json";
import Fuse from "fuse.js";
import {
  XCircle,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import EpochTime from "./components/EpochTime";
import IdGenerator from "./components/IdGenerator";
import ButtonLinkLabel from "./components/ButtonLinkLabel";

interface ItemCard {
  name: string;
  type: string;
  link: string;
  extraLinks?: Record<string, string[]>;
}

const colorMap: Record<string, string> = {
  github: " bg-slate-600",
  splunk: " bg-green-600",
  jira: " bg-blue-600",
  jenkins: "bg-orange-600",
  default: " border-4",
};

const jiraBaseLink = "https://amrp.atlassian.net/browse";

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");

  const [bottomBar, toggleBottomBar] = useState<Boolean>(false);
  type BottomBarContent = {
    title: string;
    content: string[];
  };
  const [bottomBarContent, setBottomBarContent] = useState<BottomBarContent>();
  let linkData: ItemCard[] = data as ItemCard[];
  const itemStyle =
    " rounded-xl p-5 hover:scale-105 flex flex-col h-min space-y-2";

  const fuse = new Fuse(linkData, {
    keys: ["name"],
    minMatchCharLength: 3,
    // includeMatches: true,
    includeScore: true,
  });

  useEffect(() => {
    console.log("Mounted");

    const handleKeyboardListner = (event: KeyboardEvent) => {
      if (inputRef && inputRef.current && event.code === "Escape") {
        // console.log("focus on the search bar")
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboardListner);

    return () => {
      window.removeEventListener("keydown", handleKeyboardListner);
    };
  }, []);

  const handleSearchWord = (event: any) => {
    setSearch(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key);
    if (search.startsWith("/") && event.key === "Enter") {
      const computeURL = jiraBaseLink + search.toUpperCase();
      console.log(computeURL);
      window.open(computeURL);
    } else if (event.key === "Enter") {
      window.open(fuse.search(search)[0].item.link);
    }

    if (event.key === "Escape") {
      setSearch("");
    }
  };

  const pickColorBasedOnType = (type: string) => {
    return type in colorMap ? colorMap[type] : colorMap.default;
  };

  function ItemCard({ value, index }: { value: ItemCard; index: any }) {
    const jenkinsButton = () => {
      const handleButton = () => {
        setBottomBarContent({
          title: value.name,
          content: value.extraLinks?.jenkins!,
        });
        toggleBottomBar(true);
      };
      return (
        <>
          <button
            className="flex w-full items-center space-x-2"
            onClick={handleButton}
          >
            <p className="underline">Jenkins Links</p>
          </button>
        </>
      );
    };

    return (
      <>
        <div
          key={index}
          className={twMerge(itemStyle, pickColorBasedOnType(value.type))}
        >
          <ButtonLinkLabel link={value.link} label={value.name} />
          {value.extraLinks && value.extraLinks.jenkins && jenkinsButton()}
        </div>
      </>
    );
  }

  function BottomDrawer(props: {
    content: string[] | undefined;
    title: string;
  }) {
    const data = props.content?.map((item, index) => (
      <li key={index}>
        <ButtonLinkLabel link={item} label={item} />
      </li>
    ));

    return (
      <div
        className={`sticky bottom-0 w-full rounded-t-lg bg-slate-400 p-5 text-black shadow-xl shadow-slate-300 ${bottomBar ? "block" : "hidden"}`}
      >
        <div className="flex justify-between">
          <p>{props.title}</p>
          <button onClick={() => toggleBottomBar((prev) => !prev)}>
            <XCircle size={20} />
          </button>
        </div>
        <ul className="m-auto list-outside list-disc px-5">{data}</ul>
      </div>
    );
  }

  return (
    <div className="min-w-screen relative flex min-h-screen flex-col gap-5 bg-stone-700 p-10 font-mono text-slate-200">
      <div className="flex space-x-5">
        <input
          className="h-20 flex-1 rounded-xl bg-stone-600 p-5"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(event) => handleSearchWord(event)}
          onKeyDown={(event) => handleKeyDown(event)}
          ref={inputRef}
        />
        <button onClick={() => setSearch("")}>
          <XCircle size={30} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        {fuse.search(search).map((value, index) => (
          <ItemCard value={value.item} index={index} />
        ))}
      </div>

      <h2 className="text-2xl underline underline-offset-4">Utilities</h2>
      <IdGenerator />
      <EpochTime />

      <h2 className="text-2xl underline underline-offset-4">All</h2>
      <div className="flex flex-wrap items-center gap-5">
        {linkData.map((value, index) => (
          <ItemCard value={value} index={index} />
        ))}
      </div>

      <BottomDrawer
        title={bottomBarContent?.title!}
        content={bottomBarContent?.content!}
      />

      
    </div>
  );
}

export default App;
