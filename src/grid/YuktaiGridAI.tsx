"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { GridInputLanguage } from "./types";

type UILanguage = "en-US" | "te-IN";
type InputLanguage = GridInputLanguage;

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  time: string;
}

export interface YuktaiGridAIProps<T> {
  data: T[];
  columns: {
    key: string;
    label: string;
    type?: "number" | "text" | "date";
  }[];

  onSearch?: (query: string) => void;

  onSort?: (
    key: string,
    dir: "asc" | "desc"
  ) => void;

  theme?: "light" | "dark";

  /**
   * Language of AI UI and AI responses.
   * Default: English.
   */
  language?: UILanguage;

  /**
   * Language used by browser voice recognition.
   * Default: English.
   */
  inputLanguage?: InputLanguage;

  /**
   * When true, AI is rendered inside the grid.
   * When false, AI uses the floating assistant UI.
   */
  embedded?: boolean;

  /**
   * The grid Agent.
   */
  agent?: {
    ask: (
      text: string
    ) => Promise<{
      success: boolean;
      message: string;
    }>;
    loading?: boolean;
  };

  /**
   * Called when the person switches the voice input language.
   */
  onInputLanguageChange?: (
    language: InputLanguage
  ) => void;
}

const translations: Record<
  UILanguage,
  {
    title: string;
    subtitle: string;
    ask: string;
    placeholder: string;
    listening: string;
    send: string;
    close: string;
    open: string;
    inputLanguage: string;
    speakNow: string;
    working: string;
    english: string;
    telugu: string;

    searchStarted: (value: string) => string;
    sortedAscending: (column: string) => string;
    sortedDescending: (column: string) => string;

    count: (value: number) => string;

    highest: (
      column: string,
      value: string,
      name: string
    ) => string;

    lowest: (
      column: string,
      value: string,
      name: string
    ) => string;

    average: (
      column: string,
      value: string
    ) => string;

    total: (
      column: string,
      value: string
    ) => string;

    noData: string;
    noColumn: string;
    noNumericData: (column: string) => string;
    notFound: (value: string) => string;
    needName: string;
    fallback: string;
    unsupportedVoice: string;
  }
> = {
  "en-US": {
    title: "Grid AI Assistant",
    subtitle: "Ask about your data",
    ask: "Ask",
    placeholder: "Ask or type a command...",
    listening: "Listening...",
    send: "Send",
    close: "Close",
    open: "Open AI assistant",
    inputLanguage: "Input language",
    speakNow: "Speak your question",
    working: "Working on it…",
    english: "English",
    telugu: "తెలుగు",

    searchStarted: (value) =>
      `Searching for "${value}".`,

    sortedAscending: (column) =>
      `Sorted by ${column} in ascending order.`,

    sortedDescending: (column) =>
      `Sorted by ${column} in descending order.`,

    count: (value) =>
      `There are ${value} rows in the grid.`,

    highest: (column, value, name) =>
      `The highest ${column} is ${value}, held by ${name}.`,

    lowest: (column, value, name) =>
      `The lowest ${column} is ${value}, held by ${name}.`,

    average: (column, value) =>
      `The average ${column} is ${value}.`,

    total: (column, value) =>
      `The total ${column} is ${value}.`,

    noData:
      "There is no data to analyze.",

    noColumn:
      "I could not find a column to analyze.",

    noNumericData: (column) =>
      `There is no numeric data in ${column}.`,

    notFound: (value) =>
      `I could not find anything matching "${value}".`,

    needName:
      "Please provide a value to look up.",

    fallback:
      "I can search, sort, count, and analyze the grid data.",

    unsupportedVoice:
      "Voice input is not supported in this browser.",
  },

  "te-IN": {
    title: "గ్రిడ్ AI సహాయకుడు",
    subtitle: "మీ డేటా గురించి అడగండి",
    ask: "అడగండి",
    placeholder: "ప్రశ్న లేదా ఆదేశం టైప్ చేయండి...",
    listening: "వింటున్నాను...",
    send: "పంపండి",
    close: "మూసివేయండి",
    open: "AI సహాయకుడిని తెరవండి",
    inputLanguage: "ఇన్‌పుట్ భాష",
    speakNow: "మీ ప్రశ్న చెప్పండి",
    working: "చేస్తున్నాను…",
    english: "English",
    telugu: "తెలుగు",

    searchStarted: (value) =>
      `“${value}” కోసం శోధిస్తున్నాను.`,

    sortedAscending: (column) =>
      `${column}ను ఆరోహణ క్రమంలో అమర్చాను.`,

    sortedDescending: (column) =>
      `${column}ను అవరోహణ క్రమంలో అమర్చాను.`,

    count: (value) =>
      `గ్రిడ్‌లో మొత్తం ${value} వరుసలు ఉన్నాయి.`,

    highest: (column, value, name) =>
      `అత్యధిక ${column} విలువ ${value}. ఇది ${name}కు సంబంధించినది.`,

    lowest: (column, value, name) =>
      `అత్యల్ప ${column} విలువ ${value}. ఇది ${name}కు సంబంధించినది.`,

    average: (column, value) =>
      `${column} సగటు విలువ ${value}.`,

    total: (column, value) =>
      `${column} మొత్తం విలువ ${value}.`,

    noData:
      "విశ్లేషించడానికి డేటా లేదు.",

    noColumn:
      "విశ్లేషించడానికి తగిన కాలమ్ కనబడలేదు.",

    noNumericData: (column) =>
      `${column}లో సంఖ్యా సమాచారం లేదు.`,

    notFound: (value) =>
      `“${value}”కు సరిపోలే సమాచారం కనబడలేదు.`,

    needName:
      "శోధించడానికి ఒక విలువ ఇవ్వండి.",

    fallback:
      "గ్రిడ్‌లో శోధన, క్రమబద్ధీకరణ, లెక్కింపు మరియు డేటా విశ్లేషణ చేయగలను.",

    unsupportedVoice:
      "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్‌కు మద్దతు లేదు.",
  },
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function parseIntent(
  text: string,
  language: UILanguage
): {
  type:
    | "search"
    | "sort"
    | "question";
  payload?: any;
} {
  const t = normalize(text);

  if (language === "te-IN") {
    if (
      /^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)/.test(
        t
      )
    ) {
      const term = t
        .replace(
          /^(శోధించు|శోధించండి|వెతుకు|వెతకండి|చూపించు|చూపించండి|ఫిల్టర్)\s*/u,
          ""
        )
        .trim();

      return {
        type: "search",
        payload: term || text,
      };
    }

    if (
      /క్రమబద్ధీకర|అమర్చ|సార్ట్/.test(t)
    ) {
      const desc =
        /అవరోహణ|పెద్ద|అధిక|చివర/.test(t);

      return {
        type: "sort",
        payload: {
          key: undefined,
          dir: desc ? "desc" : "asc",
        },
      };
    }

    if (
      /ఎన్ని|ఎంతమంది|లెక్క|మొత్తం వరుస|వరుసలు/.test(
        t
      )
    ) {
      return {
        type: "question",
        payload: text,
      };
    }

    if (
      /అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(
        t
      )
    ) {
      return {
        type: "question",
        payload: text,
      };
    }

    if (
      /అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(
        t
      )
    ) {
      return {
        type: "question",
        payload: text,
      };
    }

    if (
      /సగటు|సగటు విలువ/.test(t)
    ) {
      return {
        type: "question",
        payload: text,
      };
    }

    if (
      /మొత్తం|కలిపి/.test(t)
    ) {
      return {
        type: "question",
        payload: text,
      };
    }

    return {
      type: "search",
      payload: text,
    };
  }

  if (
    /^(search|find|show|filter)/.test(t)
  ) {
    const term = t
      .replace(
        /^(search|find|show|filter)\s+(for\s+|by\s+)?/,
        ""
      )
      .trim();

    return {
      type: "search",
      payload: term || text,
    };
  }

  if (/sort/.test(t)) {
    const desc =
      /desc|descending|high|higher|large|largest|top/.test(
        t
      );

    const keyMatch = t.match(
      /(?:by|on)\s+([a-z0-9_-]+)/
    );

    return {
      type: "sort",
      payload: {
        key: keyMatch?.[1],
        dir: desc ? "desc" : "asc",
      },
    };
  }

  if (
    /how many|count|highest|maximum|max|top|largest|lowest|minimum|min|smallest|bottom|average|avg|mean|sum|total|who|which|where|whose/.test(
      t
    )
  ) {
    return {
      type: "question",
      payload: text,
    };
  }

  return {
    type: "search",
    payload: text,
  };
}

function findReferencedColumn<T>(
  question: string,
  columns: YuktaiGridAIProps<T>["columns"]
) {
  const q = normalize(question);

  return columns.find(
    (column) => {
      const key = normalize(column.key);
      const label = normalize(column.label);

      return (
        q.includes(key) ||
        q.includes(label)
      );
    }
  );
}

function formatNumber(
  value: number,
  language: UILanguage
): string {
  return value.toLocaleString(
    language === "te-IN"
      ? "te-IN"
      : "en-IN"
  );
}

function answerQuestion<
  T extends Record<string, unknown>
>(
  question: string,
  data: T[],
  columns: YuktaiGridAIProps<T>["columns"],
  language: UILanguage
): string {
  const t = translations[language];

  if (data.length === 0) {
    return t.noData;
  }

  const q = normalize(question);

  const numericColumns =
    columns.filter(
      (column) =>
        column.type === "number"
    );

  const referencedColumn =
    findReferencedColumn(
      question,
      columns
    );

  const selectedNumericColumn =
    referencedColumn?.type === "number"
      ? referencedColumn
      : numericColumns[0];

  const isCountQuestion =
    /how many|count|rows|ఎన్ని|ఎంతమంది|లెక్క|వరుసలు/.test(
      q
    );

  if (isCountQuestion) {
    return t.count(data.length);
  }

  const isHighest =
    /highest|maximum|max|top|largest|అత్యధిక|గరిష్ఠ|పెద్ద|ఎక్కువ/.test(
      q
    );

  if (isHighest) {
    const column =
      referencedColumn ??
      selectedNumericColumn;

    if (!column) {
      return t.noColumn;
    }

    const values = data
      .map((row) => ({
        row,
        value: Number(
          row[column.key]
        ),
      }))
      .filter(
        (item) =>
          !Number.isNaN(item.value)
      )
      .sort(
        (a, b) =>
          b.value - a.value
      );

    if (values.length === 0) {
      return t.noNumericData(
        column.label
      );
    }

    const top = values[0];

    const nameColumn =
      columns.find(
        (columnItem) =>
          columnItem.key === "name" ||
          normalize(
            columnItem.label
          ) === "name"
      );

    const name = nameColumn
      ? String(
          top.row[
            nameColumn.key
          ] ?? ""
        )
      : language === "te-IN"
      ? "ఈ వరుస"
      : "this row";

    return t.highest(
      column.label,
      formatNumber(
        top.value,
        language
      ),
      name
    );
  }

  const isLowest =
    /lowest|minimum|min|smallest|bottom|అత్యల్ప|కనిష్ఠ|చిన్న|తక్కువ/.test(
      q
    );

  if (isLowest) {
    const column =
      referencedColumn ??
      selectedNumericColumn;

    if (!column) {
      return t.noColumn;
    }

    const values = data
      .map((row) => ({
        row,
        value: Number(
          row[column.key]
        ),
      }))
      .filter(
        (item) =>
          !Number.isNaN(item.value)
      )
      .sort(
        (a, b) =>
          a.value - b.value
      );

    if (values.length === 0) {
      return t.noNumericData(
        column.label
      );
    }

    const bottom = values[0];

    const nameColumn =
      columns.find(
        (columnItem) =>
          columnItem.key === "name" ||
          normalize(
            columnItem.label
          ) === "name"
      );

    const name = nameColumn
      ? String(
          bottom.row[
            nameColumn.key
          ] ?? ""
        )
      : language === "te-IN"
      ? "ఈ వరుస"
      : "this row";

    return t.lowest(
      column.label,
      formatNumber(
        bottom.value,
        language
      ),
      name
    );
  }

  const isAverage =
    /average|avg|mean|సగటు/.test(q);

  if (isAverage) {
    const column =
      referencedColumn ??
      selectedNumericColumn;

    if (!column) {
      return t.noColumn;
    }

    const values = data
      .map((row) =>
        Number(row[column.key])
      )
      .filter(
        (value) =>
          !Number.isNaN(value)
      );

    if (values.length === 0) {
      return t.noNumericData(
        column.label
      );
    }

    const average =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) / values.length;

    return t.average(
      column.label,
      formatNumber(
        Math.round(
          average * 100
        ) / 100,
        language
      )
    );
  }

  const isSum =
    /sum|total|మొత్తం|కలిపి/.test(q);

  if (
    isSum &&
    !isCountQuestion
  ) {
    const column =
      referencedColumn ??
      selectedNumericColumn;

    if (!column) {
      return t.noColumn;
    }

    const values = data
      .map((row) =>
        Number(row[column.key])
      )
      .filter(
        (value) =>
          !Number.isNaN(value)
      );

    if (values.length === 0) {
      return t.noNumericData(
        column.label
      );
    }

    const total =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      );

    return t.total(
      column.label,
      formatNumber(
        total,
        language
      )
    );
  }

  const queryWords =
    q.match(
      /[\p{L}\p{N}_-]+/gu
    ) ?? [];

  const ignored = new Set([
    "who",
    "what",
    "which",
    "where",
    "whose",
    "is",
    "the",
    "has",
    "have",
    "show",
    "find",
    "search",
    "for",
    "by",
    "about",
  ]);

  const meaningfulWords =
    queryWords.filter(
      (word) => !ignored.has(word)
    );

  const searchTerm =
    meaningfulWords.join(" ").trim();

  if (searchTerm) {
    const found = data.find(
      (row) =>
        Object.values(row).some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
        )
    );

    if (found) {
      return columns
        .map(
          (column) =>
            `${column.label}: ${String(
              found[column.key] ?? ""
            )}`
        )
        .join(
          language === "te-IN"
            ? " · "
            : ", "
        );
    }

    return t.notFound(searchTerm);
  }

  return t.fallback;
}

function speak(
  text: string,
  language: UILanguage
) {
  if (
    typeof window === "undefined" ||
    !window.speechSynthesis
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(
      text
    );

  utterance.lang = language;
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(
    utterance
  );
}

function useSpeechRecognition(
  language: InputLanguage
) {
  const [listening, setListening] =
    useState(false);

  const [transcript, setTranscript] =
    useState("");

  const [supported, setSupported] =
    useState(true);

  const recognitionRef =
    useRef<any>(null);

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      recognitionRef.current =
        null;
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (
      event: any
    ) => {
      const value =
        event?.results?.[0]?.[0]
          ?.transcript ?? "";

      setTranscript(value);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore stop errors.
      }

      recognitionRef.current =
        null;
    };
  }, [language]);

  const start = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }

    setTranscript("");
    setListening(true);

    try {
      recognitionRef.current.start();
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore stop errors.
    }

    setListening(false);
  }, []);

  return {
    listening,
    transcript,
    supported,
    start,
    stop,
  };
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="3"
        width="8"
        height="12"
        rx="4"
      />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
      <path d="M8 21h8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 4 16 8-16 8 4-8-4-8Z" />
      <path d="M8 12h12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export function YuktaiGridAI<
  T extends Record<string, unknown>
>({
  data,
  columns,
  onSearch,
  onSort,
  theme = "light",
  language = "en-US",
  inputLanguage = "en-US",
  embedded = false,
  agent,
  onInputLanguageChange,
}: YuktaiGridAIProps<T>) {
  const t = translations[language];

  const [voiceLanguage, setVoiceLanguage] =
    useState<InputLanguage>(
      inputLanguage
    );

  useEffect(() => {
    setVoiceLanguage(inputLanguage);
  }, [inputLanguage]);

  const [thinking, setThinking] =
    useState(false);

  const dark = theme === "dark";

  const [chatOpen, setChatOpen] =
    useState(embedded);

  const [input, setInput] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const {
    listening,
    transcript,
    supported,
    start,
    stop,
  } = useSpeechRecognition(
    voiceLanguage
  );

  const colors = useMemo(
    () => ({
      bg: dark
        ? "#0F172A"
        : "#FFFFFF",

      surface: dark
        ? "#1E293B"
        : "#F8FAFC",

      border: dark
        ? "#334155"
        : "#E2E8F0",

      text: dark
        ? "#F1F5F9"
        : "#0F172A",

      muted: dark
        ? "#94A3B8"
        : "#64748B",

      accent: "#10B981",

      userMsg: dark
        ? "#334155"
        : "#DBEAFE",

      aiMsg: dark
        ? "#1E293B"
        : "#F0FDF4",
    }),
    [dark]
  );

  const initialMessage =
    useMemo<ChatMessage>(
      () => ({
        role: "ai",
        text:
          language === "te-IN"
            ? "మీ గ్రిడ్ డేటా గురించి ప్రశ్న అడగండి."
            : "Ask me about your grid data.",
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      }),
      [language]
    );

  useEffect(() => {
    setMessages((current) => {
      if (current.length > 0) {
        return current;
      }

      return [initialMessage];
    });
  }, [initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  const timeNow = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleUserInput =
    useCallback(
      async (text: string) => {
        const value = text.trim();

        if (!value) {
          return;
        }

        setMessages((current) => [
          ...current,
          {
            role: "user",
            text: value,
            time: timeNow(),
          },
        ]);

        setInput("");

        let response = "";

        if (agent) {
          setThinking(true);

          try {
            const result =
              await agent.ask(value);

            response = result.message;
          } catch {
            response = t.fallback;
          } finally {
            setThinking(false);
          }
        } else {
          const intent = parseIntent(
            value,
            language
          );

          if (intent.type === "question") {
            response =
              answerQuestion(
                intent.payload ?? value,
                data,
                columns,
                language
              );
          } else if (
            intent.type === "search"
          ) {
            const query = String(
              intent.payload ?? value
            );

            onSearch?.(query);

            response =
              t.searchStarted(query);
          } else if (
            intent.type === "sort"
          ) {
            const requestedKey =
              intent.payload?.key;

            let column =
              requestedKey
                ? columns.find(
                    (item) =>
                      normalize(
                        item.key
                      ) ===
                        normalize(
                          requestedKey
                        ) ||
                      normalize(
                        item.label
                      ) ===
                        normalize(
                          requestedKey
                        )
                  )
                : undefined;

            if (!column) {
              column =
                findReferencedColumn(
                  value,
                  columns
                );
            }

            if (column && onSort) {
              const direction =
                intent.payload?.dir ===
                "desc"
                  ? "desc"
                  : "asc";

              onSort(
                String(column.key),
                direction
              );

              response =
                direction === "asc"
                  ? t.sortedAscending(
                      column.label
                    )
                  : t.sortedDescending(
                      column.label
                    );
            } else {
              response = t.noColumn;
            }
          }
        }

        if (!response) {
          response = t.fallback;
        }

        setMessages((current) => [
          ...current,
          {
            role: "ai",
            text: response,
            time: timeNow(),
          },
        ]);

        speak(
          response,
          language
        );
      },
      [
        agent,
        columns,
        data,
        language,
        onSearch,
        onSort,
        t,
      ]
    );

  useEffect(() => {
    if (!transcript) {
      return;
    }

    void handleUserInput(
      transcript
    );
  }, [
    transcript,
    handleUserInput,
  ]);

  const handleSubmit = () => {
    void handleUserInput(input);
  };

  const suggestions =
    language === "te-IN"
      ? [
          "ఎన్ని వరుసలు",
          "శోధించండి",
          "క్రమం",
        ]
      : [
          "how many rows",
          "search",
          "sort",
        ];

  const panel = (
    <div
      style={{
        width: embedded
          ? "100%"
          : 360,
        maxWidth: embedded
          ? "100%"
          : "calc(100vw - 48px)",
        height: embedded
          ? 390
          : 480,
        maxHeight: "70vh",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: embedded
          ? 12
          : 16,
        boxShadow: embedded
          ? "none"
          : "0 20px 40px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          background: colors.accent,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "rgba(255,255,255,0.18)",
            fontSize: 17,
          }}
        >
          AI
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {t.title}
          </div>

          <div
            style={{
              fontSize: 11,
              opacity: 0.9,
            }}
          >
            {t.subtitle}
          </div>
        </div>

        {!embedded && (
          <button
            type="button"
            onClick={() =>
              setChatOpen(false)
            }
            aria-label={t.close}
            title={t.close}
            style={{
              width: 32,
              height: 32,
              border: "none",
              borderRadius: 8,
              background:
                "rgba(255,255,255,0.12)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <div
        style={{
          padding: "8px 10px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: colors.surface,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: colors.muted,
          }}
        >
          {t.inputLanguage}
        </span>

        <select
          value={voiceLanguage}
          onChange={(event) => {
            const next =
              event.target
                .value as InputLanguage;

            setVoiceLanguage(next);

            onInputLanguageChange?.(
              next
            );
          }}
          disabled={listening}
          aria-label={t.inputLanguage}
          style={{
            padding: "5px 8px",
            borderRadius: 7,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.text,
            fontSize: 11,
          }}
        >
          <option value="en-US">
            English (US)
          </option>

          <option value="en-IN">
            English (India)
          </option>

          <option value="as-IN">
            Assamese
          </option>

          <option value="bn-IN">
            Bengali
          </option>

          <option value="brx-IN">
            Bodo
          </option>

          <option value="doi-IN">
            Dogri
          </option>

          <option value="gu-IN">
            Gujarati
          </option>

          <option value="hi-IN">
            Hindi
          </option>

          <option value="kn-IN">
            Kannada
          </option>

          <option value="ks-IN">
            Kashmiri
          </option>

          <option value="kok-IN">
            Konkani
          </option>

          <option value="mai-IN">
            Maithili
          </option>

          <option value="ml-IN">
            Malayalam
          </option>

          <option value="mni-IN">
            Manipuri
          </option>

          <option value="mr-IN">
            Marathi
          </option>

          <option value="ne-IN">
            Nepali
          </option>

          <option value="or-IN">
            Odia
          </option>

          <option value="pa-IN">
            Punjabi
          </option>

          <option value="sa-IN">
            Sanskrit
          </option>

          <option value="sat-IN">
            Santali
          </option>

          <option value="sd-IN">
            Sindhi
          </option>

          <option value="ta-IN">
            Tamil
          </option>

          <option value="te-IN">
            Telugu
          </option>

          <option value="ur-IN">
            Urdu
          </option>
        </select>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map(
          (message, index) => (
            <div
              key={`${message.time}-${index}`}
              style={{
                alignSelf:
                  message.role ===
                  "user"
                    ? "flex-end"
                    : "flex-start",
                maxWidth: "88%",
                padding:
                  "8px 11px",
                borderRadius: 11,
                background:
                  message.role ===
                  "user"
                    ? colors.userMsg
                    : colors.aiMsg,
                color: colors.text,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <div>
                {message.text}
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 10,
                  opacity: 0.55,
                  textAlign: "right",
                }}
              >
                {message.time}
              </div>
            </div>
          )
        )}

        {listening && (
          <div
            style={{
              alignSelf:
                "flex-end",
              padding:
                "8px 11px",
              borderRadius: 11,
              background: dark
                ? "#3F1D2E"
                : "#FEE2E2",
              color: dark
                ? "#FCA5A5"
                : "#991B1B",
              fontSize: 13,
            }}
          >
            {t.listening}
          </div>
        )}

        {(thinking ||
          agent?.loading) && (
          <div
            role="status"
            aria-live="polite"
            style={{
              alignSelf:
                "flex-start",
              padding:
                "8px 11px",
              borderRadius: 11,
              background:
                colors.aiMsg,
              color:
                colors.muted,
              fontSize: 13,
            }}
          >
            {t.working}
          </div>
        )}

        <div
          ref={messagesEndRef}
        />
      </div>

      <div
        style={{
          padding:
            "7px 10px",
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          gap: 6,
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {suggestions.map(
          (suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() =>
                handleUserInput(
                  suggestion
                )
              }
              style={{
                padding:
                  "5px 9px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background:
                  colors.surface,
                color:
                  colors.text,
                fontSize: 10.5,
                cursor:
                  "pointer",
                whiteSpace:
                  "nowrap",
              }}
            >
              {suggestion}
            </button>
          )
        )}
      </div>

      <div
        style={{
          padding: 9,
          display: "flex",
          gap: 6,
          borderTop: `1px solid ${colors.border}`,
          background:
            colors.surface,
        }}
      >
        <div
          style={{
            position:
              "relative",
            flex: 1,
          }}
        >
          <SearchIcon />

          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                handleSubmit();
              }
            }}
            placeholder={
              t.placeholder
            }
            aria-label={
              t.ask
            }
            style={{
              width: "100%",
              boxSizing:
                "border-box",
              padding:
                "9px 10px 9px 34px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              background:
                colors.bg,
              color:
                colors.text,
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>

        {supported ? (
          <button
            type="button"
            onClick={
              listening
                ? stop
                : start
            }
            aria-label={
              listening
                ? t.listening
                : t.speakNow
            }
            title={
              listening
                ? t.listening
                : t.speakNow
            }
            style={{
              width: 38,
              height: 38,
              border: "none",
              borderRadius: 8,
              background:
                listening
                  ? "#EF4444"
                  : colors.accent,
              color:
                "#FFFFFF",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              cursor:
                "pointer",
              flexShrink: 0,
            }}
          >
            <MicIcon />
          </button>
        ) : null}

        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={
            !input.trim()
          }
          aria-label={
            t.send
          }
          title={
            t.send
          }
          style={{
            width: 38,
            height: 38,
            border: "none",
            borderRadius: 8,
            background:
              input.trim()
                ? colors.accent
                : colors.muted,
            color:
              "#FFFFFF",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            cursor:
              input.trim()
                ? "pointer"
                : "not-allowed",
            opacity:
              input.trim()
                ? 1
                : 0.6,
            flexShrink: 0,
          }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div
        style={{
          width: "100%",
          minWidth: 0,
        }}
      >
        {chatOpen ? (
          panel
        ) : (
          <button
            type="button"
            onClick={() =>
              setChatOpen(true)
            }
            aria-label={t.open}
            style={{
              minHeight: 40,
              padding:
                "8px 13px",
              borderRadius: 9,
              border:
                "1px solid #10B981",
              background: dark
                ? "#064E3B"
                : "#ECFDF5",
              color: dark
                ? "#A7F3D0"
                : "#047857",
              display:
                "inline-flex",
              alignItems:
                "center",
              gap: 8,
              cursor:
                "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span aria-hidden="true">
              AI
            </span>

            {t.ask}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {!chatOpen && (
        <button
          type="button"
          onClick={() =>
            setChatOpen(true)
          }
          aria-label={t.open}
          title={t.title}
          style={{
            position:
              "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9998,
            width: 56,
            height: 56,
            borderRadius: 28,
            background:
              colors.accent,
            color:
              "#FFFFFF",
            border: "none",
            cursor:
              "pointer",
            boxShadow:
              "0 8px 20px rgba(16,185,129,0.3)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          AI
        </button>
      )}

      {chatOpen && (
        <div
          style={{
            position:
              "fixed",
            bottom: 90,
            right: 24,
            zIndex: 9997,
          }}
        >
          {panel}
        </div>
      )}

      <style>{`
        @keyframes yuktai-ai-pulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}

export default YuktaiGridAI;