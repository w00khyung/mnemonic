import * as Api from '/api.js';

addAllElements();
const user_id = '';
// 댓글 작성자 리스트

let timerComment = true;
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  await renderCommentDetail();
  await commentList();
}

async function renderCommentDetail() {
  const wrap = document.querySelector('.comment-write-wrap');
  const commentWriteWrap = `
  <div class="write-container">
    <article class="media">
      <figure class="media-left">
        <p class="">
        </p>
      </figure>
      <div class="media-content">
        <div class="field">
          <p class="control">
            <textarea class="textarea" id="sendCommentText" placeholder="댓글을 작성하세요."></textarea>
          </p>
        </div>
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <button class="button is-black" id="sendCommentBtn">Submit</button>
            </div>
          </div>
        </nav>
      </div>
    </article>
  </div>  
`;

  wrap.innerHTML = commentWriteWrap;

  // 요소(element), input 혹은 상수
  const sendCommentBtn = document.querySelector('#sendCommentBtn');

  sendCommentBtn.addEventListener('click', handleSendComment);
}

async function handleSendComment(e) {
  e.preventDefault();
  // 토큰 아니면
  if (
    !sessionStorage.getItem('accessToken') ||
    !sessionStorage.getItem('refreshToken')
  ) {
    alert('로그인이 필요합니다.');
    return (window.location.href = '/login');
  }
  const sendCommentText = document.querySelector('#sendCommentText');
  const email = sessionStorage.getItem('email');
  const mail = {
    email,
  };
  const user = await Api.post('/api/checkUserMail', mail);
  // 유효하지 않을경우 로그인 필요
  if (user.result !== 'valid') {
    alert('로그인이 필요합니다.');
    return (window.location.href = '/login');
  }

  // 계속 누를 경우 위한 처리
  if (timerComment === true) {
    // 데이터 정리
    const writer = user.user._id;
    const post = sessionStorage.getItem('productId');
    const comment = sendCommentText.value;
    if (comment === '') {
      alert('값을 적어주세요.');
      return;
    }
    const data = {
      writer,
      post,
      comment,
    };
    await Api.post('/api/comment', data);

    timerComment = false;
    sendCommentText.value = '';
    setTimeout(() => {
      timerComment = true;
    }, 10000);
    await commentList();
  } else {
    alert('10초후 보내세요.');
  }
}
async function commentList() {
  // eslint-disable-next-line prefer-const

  const Listwrap = document.querySelector('.comment-list-wrap');
  // const data = {
  //   productId: sessionStorage.getItem('productId'),
  // };
  const commentListData = await Api.get(
    '/api/comment/products',
    sessionStorage.getItem('productId')
  );
  const email = sessionStorage.getItem('email');
  const mail = {
    email,
  };
  let compareUserId = '';
  if (email !== null) {
    const user = await Api.post('/api/checkUserMail', mail);
    compareUserId = user.user._id;
  }

  let commentListwrap = '';
  // 수정 삭제 넣기
  for (let i = 0; i < commentListData.length; i++) {
    commentListwrap += `
    <div class = "write-modify-container">
  <div class="write-container">
    <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
    
        <p>
          <strong>${commentListData[i].writer.fullName}</strong>
          <br>
         ${commentListData[i].comment}
          <br>
          <small> <a class="subcreateBtn">Reply</a> · 
          <a class="modifyCommentBtn">${
            commentListData[i].writer._id === compareUserId ? '수정 </a> ·' : ''
          }
          
          <a class="deleteCommentBtn">${
            commentListData[i].writer._id === compareUserId ? '삭제 </a> ·' : ''
          }
          ${commentListData[i].updatedAt} <a class="commentId">${
      commentListData[i]._id
    }</a></small>
        </p>
      </div>
      </div>
    </article>
  </div>
  <div class="modify-container  hidden">
 ${
   commentListData[i].writer._id === compareUserId
     ? `
  <article class="media">
    <figure class="media-left">
      <p class="">
      </p>
    </figure>
    <div class="media-content">
      <div class="field">
        <p class="control">
          <textarea class="textarea modifyCommentText"  placeholder="댓글을 작성하세요."></textarea>
        </p>
      </div>
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <button class="button is-black sendModifyCommentBtn" id="sendModifyCommentBtn${i}">Submit</button>
            <button class="button is-light cancel " id="cancel${i}">Cancel</button>
          </div>
        </div>
      </nav>
    </div>
  </article>`
     : ''
 }
 </div>
 </div>
  `;
  }
  Listwrap.innerHTML = commentListwrap;

  // 수정 삭제 클릭 이벤트
  const modifyCommentBtn = document.getElementsByClassName('modifyCommentBtn');
  const deleteCommentBtn = document.getElementsByClassName('deleteCommentBtn');
  const sendModifyCommentBtn = document.getElementsByClassName(
    'sendModifyCommentBtn'
  );
  const cancelBtn = document.getElementsByClassName('cancel');

  const modifyContainer = document.getElementsByClassName('modify-container');
  const modifyCommentText =
    document.getElementsByClassName('modifyCommentText');

  // 수정 취소
  if (cancelBtn) {
    for (let i = 0; i < cancelBtn.length; i++) {
      cancelBtn[i].addEventListener(
        'click',
        (e) => cancelComment(e, modifyContainer[i]),
        false
      );
    }
  }

  // 수정 컨테이너 보이게 하기
  if (modifyCommentBtn) {
    for (let i = 0; i < modifyCommentBtn.length; i++) {
      modifyCommentBtn[i].addEventListener(
        'click',
        (e) => showModifyComment(e, modifyContainer[i]),
        false
      );
    }
  }

  // 댓글 삭제
  if (deleteCommentBtn) {
    for (let i = 0; i < deleteCommentBtn.length; i++) {
      deleteCommentBtn[i].addEventListener('click', deleteComment, false);
    }
  }

  // 수정 한 값 보내기
  if (sendModifyCommentBtn) {
    for (let i = 0; i < sendModifyCommentBtn.length; i++) {
      sendModifyCommentBtn[i].addEventListener(
        'click',
        (e) => sendModifyComment(e, modifyCommentText[i]),
        false
      );
    }
  }
}

async function deleteComment(e) {
  const commentId = e.path[2].innerText.split('\n')[3];
  const data = {
    commentId,
  };
  const result = await Api.delete('/api/comment', commentId, data);

  // 다시 보여주기
  await commentList();
}

function showModifyComment(e, modifyContainer) {
  modifyContainer.classList.remove('hidden');
}

function cancelComment(e, modifyContainer) {
  modifyContainer.classList.add('hidden');
}

async function sendModifyComment(e, modifyCommentText) {
  const comment = `${modifyCommentText.value}(수정)`;
  const sendCommentWriter =
    e.path[7].firstElementChild.innerText.split('\n')[3];

  const data = {
    comment,
  };
  const result = await Api.patch('/api/comment', sendCommentWriter, data);

  // 다시 보여주기
  await commentList();
}
