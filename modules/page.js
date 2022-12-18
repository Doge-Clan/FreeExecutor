export const WindowPage = {
	url: window.location.href,
	isLocal: window.location.href.includes(":/") || window.location.href.indexOf('/') === 0, // Saved File (Windows/NT), Saved File (unix/unix like)
};

/*
  window.page/WindowPage is a new extension to the Window API that can be used to get various information
  on the injected page from a bookmarklet perspective
*/