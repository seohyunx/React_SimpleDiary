import "./App.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeTest";
// import Lifecycle from "./Lifecycle";

function App() {
  //전역적으로 가장위에서 데이터들을 관리해줄 전역 state 만들기
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const getData = async () => {
    // const res = await fetch("https://jsonplaceholder.typicode.com/comments");
    // const data = await res.json();
    // console.log(data);
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());
    console.log(res);

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1, //랜덤으로 1~5까지 감정점수 뽑기
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  //일기 배열에 새로운 일기 추가하는 함수
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();

    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1; //다음 일기 아이템ID는 1증가
    setData([newItem, ...data]); //원래 배열에 있던 데이터를 하나하나씩 나열하겠다(spread 연산자)
  };

  //삭제하기 함수
  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    console.log(newDiaryList);
    setData(newDiaryList);
  };

  //수정하기 함수
  const onEdit = (targetId, newContent) => {
    setData(
      //data를 map으로 순회하면서 새로운 배열을 만들어서 setData에 전달.
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  };

  //감정 점수 분석 함수
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]); //useMemo(()=>{},[])

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      {/* <Lifecycle /> */}
      <OptimizeTest />
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수: {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;
