import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

export default function passageReading() {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingCompleted, setIsRecordingCompleted] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState([]);

  const recorderControls = useAudioRecorder();

  const fetchPassageTitleAndText = async () => {
    console.log("In fetchPassageTitleAndText()");

    // console.log("Passage ID", sessionStorage.getItem("passage_id"));
    const passageRef = doc(db, "passage", sessionStorage.getItem("passage_id"));
    const passageSnap = await getDoc(passageRef);

    if (passageSnap.exists()) {
      let passage = passageSnap.data();

      setTitle(passage.title);
      setText(passage.text.split("\\n"));

      console.log(title);
    } else {
      console.log("Failed to fetch passage.");
    }
  };

  const getAudioFile = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");

    console.log("url", url);
    console.log("audio", audio);

    const audioFile = new Audio(url);
    console.log("audioFile", audioFile);

    audio.src = url;
    audio.controls = true;

    setIsRecordingCompleted(true);
  };

  useEffect(() => {
    fetchPassageTitleAndText();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Text */}
      <div className="p-12 md:px-16 pt-8">
        <BackButton />
        <div className="flex flex-col flex-1 text-center py-8 px-8 md:px-20 lg:px-60 gap-8">
          <h1 className="font-bold text-6xl">{title}</h1>
          <div className="text-justify text-3xl">
            {text.map((line) => {
              return <p className="indent-12 leading-loose">{line.trim()}</p>;
            })}
          </div>
        </div>
      </div>

      {/* Footer  */}
      <div className="flex flex-row bg-coraBlue-3 justify-between items-center fixed bottom-0 p-4 w-full">
        <AudioRecorder
          onRecordingComplete={(blob) => getAudioFile(blob)}
          recorderControls={recorderControls}
        ></AudioRecorder>

        {/* Recording indicator */}
        {/* <div
          className={`flex flex-row items-center gap-2 ${
            isRecording && !isRecordingCompleted ? "visible" : "invisible"
          }`}
        >
          <div className="animate-pulse">
            <FontAwesomeIcon icon={faCircle} color="#FB3C3C" size="sm" />
          </div>
          <p className="">Recording</p>
        </div>

        {!isRecording && (
          <button
            className="flex flex-col hover:text-gray-800 text-md"
            onClick={() => {
              setIsRecording(true);
              recorderControls.startRecording;
              console.log("Start recording.");
            }}
          >
            <FontAwesomeIcon icon={faCircle} color="#FB3C3C" size="2xl" />
            Start Recording
          </button>
        )}

        {isRecording && !isRecordingCompleted && (
          <button
            className="flex flex-col hover:text-gray-800 text-md"
            onClick={(e) => {
              setIsRecordingCompleted(true);
              recorderControls.stopRecording;
              console.log("Stop recording.");
            }}
          >
            <FontAwesomeIcon icon={faSquare} size="2xl" />
            Stop
          </button>
        )}
        {isRecordingCompleted && (
          <div className="flex flex-col hover:text-gray-800 text-md">
            <FontAwesomeIcon icon={faCheck} color="green" size="2xl" />
            Reading Recording Saved
          </div>
        )} */}

        {/* Take quiz button */}
        <Link href="/student/takeQuiz">
          <button
            className={`flex flex-row items-center gap-2 bg-white px-4 py-2 font-bold border-1 rounded-md shadow-sm ${
              isRecordingCompleted ? "visible" : "invisible"
            }`}
          >
            <p className="text-lg">Take Quiz</p>
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </button>
        </Link>
      </div>
    </div>
  );
}
