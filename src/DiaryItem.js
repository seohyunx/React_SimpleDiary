import React, { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryItem = ({
  author,
  content,
  created_date,
  emotion,
  id,
  // onRemove,
  // onEdit,
}) => {
  const { onRemove, onEdit } = useContext(DiaryDispatchContext);

  //수정하기 상태 판별
  const [isEdit, setIsEdit] = useState(false);
  //toggleIsEdit 함수 : 호출되는 순간 원래 isEdit이 가지고 있던 값을 반전시킴
  const toggleIsEdit = () => setIsEdit(!isEdit); //toggle: 반전연산
  //textarea(수정폼)의 input을 핸들링할 state
  const [localContent, setLocalContent] = useState(content);

  const localContentInput = useRef();

  //삭제하기 함수
  const handleRemove = () => {
    console.log("삭제실행 ID : ", id);
    if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
      onRemove(id);
    }
  };

  //수정폼에 기존 content 그대로 불러오기 함수
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  //수정완료 버튼을 눌렀을 때 이벤트를 처리할 함수
  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus(); //내용이 5글자 이하면 포커스 처리하기
      return;
    }
    if (window.confirm(`${id}번째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
    console.log("일기 수정 완료 : ", localContent);
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자 : {author} | 감정점수 : {emotion}
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      {/* isEdit이 true라면 a : false라면 b 실행 */}
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            />
          </>
        ) : (
          <>{localContent}</>
        )}
      </div>

      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
