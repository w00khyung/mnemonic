import * as Api from '/api.js';
import { isAuth, getCookie, timeForToday } from '../../useful-functions.js';

let timerComment = true;
await addAllElements();

// 댓글 작성자 리스트

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
  if (!isAuth()) {
    alert('로그인이 필요합니다.');
    return (window.location.href = '/login');
  }
  const sendCommentText = document.querySelector('#sendCommentText');
  const email = getCookie('email');
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
    await Api.post('/api/comment', data, true);

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
async function commentList(page = 1) {
  const Listwrap = document.querySelector('.comment-list-wrap');

  // 페이지 값( 값이 없는 경우 기본값은 1)

  // 한 페이지당 몇개의 게시물을 출력할지
  const limit = 5;

  const sendPageInfo = {
    page,
    limit,
    productId: sessionStorage.getItem('productId'),
  };
  const commentListData = await Api.post(
    '/api/comment/products',
    sendPageInfo,
    true
  );

  // 총 댓글 갯수
  const totCount = commentListData.allCommentsLength;

  // 마지막 페이지 수 구하기 2.5가 되면 마지막 페이지는 3이 됨
  const lastPageNum = Math.ceil(totCount / limit);

  // 페이지 블럭 1~5
  const blockSize = 5;

  // 현재 블럭 위치 (0부터 시작)-> 블럭 한묶음(1~5), 블럭 다음 묶음 (6~10)이고 페이지가 7이면 해당 블럭은 1번째 블럭에 존재
  const blockNum = Math.floor((page - 1) / blockSize);

  // 위와 같으면 6부터 시작해되므로 이런 식으로 나오게 됨: 블럭의 시작 위치
  const blockStart = Math.floor(blockSize * blockNum + 1);

  // 위와 같이 블럭의 마지막 위치를 구함 6+4 = 10이 나옴
  const blockLast = Math.ceil(blockStart + (blockSize - 1));

  if (commentListData.comments.length > 0) {
    const email = getCookie('email');
    const mail = {
      email,
    };
    let compareUserId = '';
    if (email !== null) {
      const user = await Api.post('/api/checkUserMail', mail);
      compareUserId = user.user._id;
    }
    // <a class="subcreateBtn">Reply</a> · 추후 대댓글 하기
    let commentListwrap = '';
    // 수정 삭제 넣기
    for (let i = 0; i < commentListData.comments.length; i++) {
      const date = timeForToday(commentListData.comments[i].updatedAt);
      commentListwrap += `
    <div class = "write-modify-container">
  <div class="write-container">
    <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">${i + 1 + (page - 1) * limit}
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
    
        <p>
          <strong>${commentListData.comments[i].writer.fullName}</strong>
          <br>
         ${commentListData.comments[i].comment}
          <br>
          <small>  
          ${
            commentListData.comments[i].writer._id === compareUserId
              ? ` <a class="modifyCommentBtn" data-value="${commentListData.comments[i]._id}" > 수정 </a> ·`
              : ''
          }
          
          <a class="deleteCommentBtn">${
            commentListData.comments[i].writer._id === compareUserId
              ? '삭제 </a> ·'
              : ' </a>'
          }
          ${date} <a class="commentId">${
        commentListData.comments[i]._id
      }</a></small>
        </p>
      </div>
      </div>
    </article>
  </div>
  <div class="modify-container">
 ${
   commentListData.comments[i].writer._id === compareUserId
     ? `
  <article class="media cancel-modify hidden">
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

    // 페이지 네이션 구하기
    const paginationWrap = document.querySelector('.pagination-wrap');
    let pageWrap = `
    <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    `;

    // 이전 페이지
    if (blockStart - 1 > 0) {
      pageWrap += `<a class="pagination-previous" data-value="${
        blockStart - 1
      }">Previous</a>`;
    }

    // 이후 페이지
    if (blockLast < lastPageNum) {
      pageWrap += ` <a class="pagination-next" data-value="${
        blockLast + 1
      }">Next page</a>`;
    }
    pageWrap += `
   
    <ul class="pagination-list">`;
    for (let i = blockStart; i < blockLast + 1; i++) {
      // eslint-disable-next-line eqeqeq
      if (i <= lastPageNum) {
        if (i == page) {
          pageWrap += `<li class="pagination-link is-current" aria-label="Page ${i}" aria-current="page">${i}</li>`;
        } else {
          pageWrap += `<li><a class="pagination-link paginationBtn" aria-label="Goto page ${i}">${i}</a></li>`;
        }
      }
    }

    pageWrap += `
    </ul>
  </nav>`;

    paginationWrap.innerHTML = pageWrap;
    Listwrap.innerHTML = commentListwrap;

    /** 페이지네이션 클릭 이벤트 */
    const paginationBtn = document.getElementsByClassName('paginationBtn');
    if (paginationBtn) {
      for (let i = 0; i < paginationBtn.length; i++) {
        paginationBtn[i].addEventListener(
          'click',
          (e) => paginationHandle(e),
          false
        );
      }
    }
    if (blockStart - 1 > 0) {
      const paginationPreviousBtn = document.querySelector(
        '.pagination-previous'
      );
      paginationPreviousBtn.addEventListener('click', paginationPrevious);
    }
    if (blockLast < lastPageNum) {
      const paginationNextBtn = document.querySelector('.pagination-next');
      paginationNextBtn.addEventListener('click', paginationNext);
    }

    /* 댓글 클릭 이벤트 */
    // 수정 삭제 클릭 이벤트
    const modifyCommentBtn =
      document.getElementsByClassName('modifyCommentBtn');
    const deleteCommentBtn =
      document.getElementsByClassName('deleteCommentBtn');
    const sendModifyCommentBtn = document.getElementsByClassName(
      'sendModifyCommentBtn'
    );
    const cancelBtn = document.getElementsByClassName('cancel');

    const media = document.getElementsByClassName('cancel-modify');
    const modifyCommentText =
      document.getElementsByClassName('modifyCommentText');
    // 수정 취소
    if (cancelBtn) {
      for (let i = 0; i < cancelBtn.length; i++) {
        cancelBtn[i].addEventListener(
          'click',
          (e) => cancelComment(e, media[i]),
          false
        );
      }
    }

    // 수정 컨테이너 보이게 하기
    if (modifyCommentBtn) {
      for (let i = 0; i < modifyCommentBtn.length; i++) {
        modifyCommentBtn[i].addEventListener(
          'click',
          (e) => showModifyComment(e, media[i]),
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
          (e) => sendModifyComment(e, modifyCommentText[i], i),
          false
        );
      }
    }
  }
}

async function deleteComment(e) {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    const commentId = e.path[2].innerText.split('\n')[3];
    const data = {
      commentId,
    };
    const result = await Api.delete('/api/comment', commentId, data, true);

    // 다시 보여주기
    await commentList();
  }
}

function showModifyComment(e, modifyContainer) {
  modifyContainer.classList.remove('hidden');
}

function cancelComment(e, modifyContainer) {
  modifyContainer.classList.add('hidden');
}

async function sendModifyComment(e, modifyCommentText, i) {
  let comment = modifyCommentText.value;
  if (comment === '') {
    alert('값을 적어주세요.');
    return;
  }
  if (confirm('댓글을 수정하시겠습니까?')) {
    const modifyCommentBtn =
      document.getElementsByClassName('modifyCommentBtn')[i];
    console.log(modifyCommentBtn.dataset.value);
    comment = `${comment}(수정)`;
    const sendCommentWriter = modifyCommentBtn.dataset.value;

    const data = {
      comment,
    };
    await Api.patch('/api/comment', sendCommentWriter, data, true);

    // 다시 보여주기
    await commentList();
  }
}

async function paginationHandle(e) {
  const page = e.path[0].innerText;
  await commentList(page);
}
async function paginationPrevious() {
  const paginationPreviousBtn = document.querySelector('.pagination-previous');
  const page = paginationPreviousBtn.dataset.value;
  await commentList(page);
}

async function paginationNext() {
  const paginationNextBtn = document.querySelector('.pagination-next');
  const page = paginationNextBtn.dataset.value;
  await commentList(page);
}
