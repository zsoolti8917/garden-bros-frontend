"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FiPlus } from "react-icons/fi";
import useMeasure from "react-use-measure";

const TabsFAQ = ({ data }: { data: any }) => {
  // Extract tab names from data categories
  const tabs = data.category.map((cat: any) => cat.categoryName);
  const [selected, setSelected] = useState(tabs[0]);

  // Create a map of questions based on selected tab
  const questionsMap = data.category.reduce((acc: any, cat: any) => {
    acc[cat.categoryName] = cat.question;
    return acc;
  }, {});

  return (
    <section className="overflow-hidden px-4 py-12 min-h-[80vh] text-black ">
      <div className="max-w-[1440px] bg-white mx-auto lg:min-h-[70vh] pt-10 pb-10 rounded-2xl shadow-2xl">
      <Heading />
      <Tabs selected={selected} setSelected={setSelected} tabs={tabs} />
      <Questions selected={selected} questionsMap={questionsMap} />
      </div>
      
    </section>
  );
};

const Heading = () => {
  return (
    <>
      <div className="relative z-10 flex flex-col items-center justify-center">
      <h2 className="text-5xl text-center pb-10 text-primary-700 font-bold">Často Kladené Otázky (FAQ)</h2>
        <span className="text-center  pb-10 mx-auto max-w-[800px]">
        Na tejto stránke nájdete odpovede na najčastejšie otázky týkajúce sa našich služieb. Kliknutím na jednotlivé kategórie si môžete prezrieť najčastejšie otázky, a kliknutím na konkrétnu otázku sa zobrazí odpoveď.
        </span>
        
      </div>


    </>
  );
};

const Tabs = ({
  selected,
  setSelected,
  tabs,
}: {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  tabs: string[];
}) => {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
      {tabs.map((tab) => (
        <button
          onClick={() => setSelected(tab)}
          className={`relative overflow-hidden whitespace-nowrap rounded-md border-[1px] px-3 py-1.5 text-sm font-medium transition-colors duration-500 ${
            selected === tab
              ? "border-primary-800 text-white"
              : "border-primary-800 bg-primary-500 text-white"
          }`}
          key={tab}
        >
          <span className="relative z-10">{tab}</span>
          <AnimatePresence>
            {selected === tab && (
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{
                  duration: 0.5,
                  ease: "backIn",
                }}
                className="absolute inset-0 z-0 bg-gradient-to-r from-primary-700 to-primary-800"
              />
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
};

const Questions = ({
    selected,
    questionsMap,
  }: {
    selected: string;
    questionsMap: { [key: string]: { id: number; question: string; answer: string }[] };
  }) => {
    const questions = questionsMap[selected] || [];
  
    return (
      <div className="mx-auto mt-12 max-w-3xl px-2 lg:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected} // Ensure a new key when selected changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              ease: "backIn",
            }}
            className="space-y-4"
          >
            {questions.map((q) => (
              <Question key={q.id} {...q} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

const Question = ({ question, answer }: QuestionType) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className={`rounded-xl border-[1px] border-primary-800 px-4 transition-colors ${
        open ? "bg-primary-700" : "bg-primary-800"
      }`}
    >
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="flex w-full items-center justify-between gap-4 py-4"
      >
        <span
          className={`text-left text-lg font-medium transition-colors ${
            open ? "text-white" : "text-white"
          }`}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: {
              rotate: "45deg",
            },
            closed: {
              rotate: "0deg",
            },
          }}
        >
          <FiPlus
            className={'text-2xl text-white' }
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-white"
      >
        <p ref={ref}>{answer}</p>
      </motion.div>
    </motion.div>
  );
};

type QuestionType = {
  question: string;
  answer: string;
};

export default TabsFAQ;
