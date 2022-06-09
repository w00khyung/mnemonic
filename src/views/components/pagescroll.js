const topBtn = document.querySelector('.backtotop');
const headerNve = document.querySelector('.shopping-mall-header');

window.addEventListener('scroll', (e) => {
  e.preventDefault();
  if (window.scrollY < 749) {
    topBtn.style.display = 'flex';
    topBtn.style.opacity = '0';
  } else if (window.scrollY >= 750) {
    topBtn.style.display = 'flex';
    topBtn.style.opacity = '1';
  } else if (window.scrollY < 700) {
    topBtn.style.display = 'none';
    topBtn.style.opacity = '0';
  }

  if (window.scrollY < 300) {
    headerNve.style.backgroundColor = "rgba(255, 255 ,255, 0)";
  } else if (window.scrollY >= 300 && window.scrollY < 320) {
    headerNve.style.backgroundColor = "rgba(255, 255 ,255, 0.1)";
  } else if (window.scrollY >= 320 && window.scrollY < 350) {
    headerNve.style.backgroundColor = "rgba(255, 255 ,255, 0.3)";
  } else if (window.scrollY >= 350 && window.scrollY < 380) {
    headerNve.style.backgroundColor = "rgba(255, 255 ,255, 0.7)";
  } else if (window.scrollY >= 380 && window.scrollY < 400) {
    headerNve.style.backgroundColor = "rgba(255, 255 ,255, 0.9)";
  } else if (window.scrollY >= 400) {
    headerNve.style.backgroundColor = "rgba(255, 255 ,255, 1)";
  }
});

function pageScroll() {
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export { pageScroll };
