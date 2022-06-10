import * as Api from '/api.js';

// 문자열+숫자로 이루어진 랜덤 5글자 반환
export const randomId = () => Math.random().toString(36).substring(2, 7);

// 이메일 형식인지 확인 (true 혹은 false 반환)
export const validateEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 휴대폰 번호 하이픈 추가
export const addHyphen = (n) =>
  n.toString().replace(/\B(?=(\d{4})+(?!\d))/g, '-');

// 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) =>
  parseInt(string.replace(/(,|개|원)/g, ''));

// ms만큼 기다리게 함.
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const isAuth = () => {
  if (document.cookie.includes('refreshToken')) {
    return true;
  }
  return false;
};

export const getCookie = (cookie) => {
  const idx = document.cookie.indexOf(cookie);

  if (idx === -1) {
    return false;
  }
  const cookieValue = document.cookie
    .slice(idx)
    .split(';')
    .find((row) => row.startsWith(cookie))
    .split('=')[1];

  return cookieValue;
};

export const deleteCookie = (cookie) => {
  document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
};

export const checkToken = async () => {
  // access가 존재하지 않을 때만 요청 보내기
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');

  if (refreshToken) {
    if (!accessToken) {
      // refresh 검증 후 재발급 요청
      const result = await fetch('/api/validateToken', {
        method: 'GET',
      });
      // 검증 실패, 재발급 되지 않음.
      if (result.status === 401) {
        console.log(await result.json());
        return false;
      }
      // 정상적으로 재발급 됨.
      return true;
    }
    // access, refresh 모두 존재함.
    return true;
  }
  // access, refresh token 모두 존재하지 않을 경우
  return false;
};

export const timeForToday = (value) => {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};

export const checkAdminToken = async () => {
  const token = getCookie('accessToken');
  if (token) {
    const res = await fetch('/api/isAdmin', {
      method: 'GET',
    });
    if (res.ok) {
      return true;
    }
    return false;
  }
};
