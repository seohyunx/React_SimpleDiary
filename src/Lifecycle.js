import React, { useEffect, useState } from "react";

const UnmountTest = () => {
  useEffect(() => {
    console.log("Mount!");
    //Unmount는 Mount를 감지하는 useEffect에 함수를 하나 만들어서
    //return 시키는 방식으로 Unmount를 감지할 수 있다.
    return () => {
      // Unmount 시점에 실행되게 됨
      console.log("Unmount!");
    };
  }, []);
  return <div>Unmount Testing Component</div>;
};

const Lifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => setIsVisible(!isVisible); //토글기능

  // const [count, setCount] = useState(0); //카운트 state
  // const [text, setText] = useState(""); //input에 사용될 텍스트 state

  //컴포넌트 마운트 시점에만 실행하고 싶은 작업이 있다면
  //useEffect의 두번째 파라미터인 Depth에 빈 배열을 전달한 다음,
  //콜백함수에 하고싶은 작업을 넣어주면 된다.
  // useEffect(() => {
  //   console.log("Mount!");
  // }, []);

  // //update 시에 실행 (dependency array가 없는 타입)
  // useEffect(() => {
  //   console.log("Update!");
  // });

  // //count state가 변화하는 순간 callback함수를 다시 호출
  // useEffect(() => {
  //   console.log(`count is update : ${count}`);
  //   if (count > 5) {
  //     alert("count가 5를 넘었습니다. 따라서 1로 초기화합니다.");
  //     setCount(1);
  //   }
  // }, [count]);

  // useEffect(() => {
  //   console.log(`text is update : ${text}`);
  // }, [text]);

  return (
    <div style={{ padding: 20 }}>
      {/* <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></input>
      </div> */}

      <button onClick={toggle}>ON/OFF</button>
      {/* 단락회로평가를 통해 isVisible이 true 이면 <UnmountTest/>를 실행
          아니면 실행하지 않음*/}
      {isVisible && <UnmountTest />}
    </div>
  );
};

export default Lifecycle;
