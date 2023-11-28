import "./App.css";
import React, { //비구조화 할당이 아닌 React는 이름을 바꿔서 import할 수 있음
  useCallback, //중괄호 안의 react 기능들은 비구조화 할당을 통해 import를 받고있기 때문에
  useEffect, //import시에 이름을 바꿀 수 없음
  useMemo,
  useReducer,
  useRef,
} from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import OptimizeTest from "./OptimizeTest";
import Lifecycle from "./Lifecycle";

//Dispatch를 호출하면 Reducer가 실행되고, 그 Reducer가 Return하는
//값이 이 데이터의 값이 된다.

//첫번째 파라미터(상태변화가 일어나기 직전의 state)
//두번째 파라미터(어떤 상태변화를 일으켜야 되는지에 대한 정보들이 담겨있는 action 객체)
const reducer = (state, action) => {
  switch (
    action.type //reducer가 return하는 값이 data의 값이 된다
  ) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

//export default는 파일 하나당 1개만 사용 가능
//export만 붙이면 여러번 내보낼 수 있음
export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

function App() {
  //전역적으로 가장위에서 데이터들을 관리해줄 전역 state 만들기
  // const [data, setData] = useState([]);

  // 상태변화를 처리할 함수인 reducer
  // useState 대신 useReducer를 사용하는 이유
  // - 복잡한 상태로직을 컴포넌트 밖으로 분리하기 위해 사용
  // - 그래서 App 컴포넌트 밖에다가 const reducer 하고 컴포넌틀를 만들자
  // useReducer()
  const [data, dispatch] = useReducer(reducer, []);

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

    dispatch({ type: "INIT", data: initData });
    // setData(initData); //setData함수가 할 일을 reducer함수가 할거니까 주석
  };

  useEffect(() => {
    getData();
  }, []);

  //일기 배열에 새로운 일기 추가하는 함수
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dataId.current,
    // };
    dataId.current += 1; //다음 일기 아이템ID는 1증가
    // setData((data) => [newItem, ...data]); //원래 배열에 있던 데이터를 하나하나씩 나열하겠다(spread 연산자)
  }, []); //두번째 파라미터를 []빈 배열로 전달 : 마운트되는 시점에만 렌더링 되도록 만듦.
  //그 다음 부터는 첫번째 파라미터의 함수를 기억했다가 재사용(처음에만 렌더링 되고 리렌더링 X)

  //삭제하기 함수
  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
    // setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  //수정하기 함수
  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId });
    // setData((data) =>
    //   //data를 map으로 순회하면서 새로운 배열을 만들어서 setData에 전달.
    //   data.map((it) =>
    //     it.id === targetId ? { ...it, content: newContent } : it
    //   )
    // );
  }, []);

  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []); //절대 재생성되는 일이 없게 Depth를 빈배열로 전달.

  //감정 점수 분석 함수
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]); //useMemo(()=>{},[])

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          {/* <Lifecycle /> */}
          {/* <OptimizeTest /> */}
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수: {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
