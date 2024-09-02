function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function router() {
    const routes = {
        '/': renderHomePage,
        '/pingpong': renderPingPongPage,
        '/scores': renderScoresPage, // Example additional route
    };

    const view = routes[window.location.pathname] || renderNotFoundPage;
    view();
}

function renderHomePage() {
    fetch('/').then(response => response.text()).then(html => {
        document.getElementById('app').innerHTML = html;
    });
}

function renderPingPongPage() {
    fetch('/pingpong/').then(response => response.text()).then(html => {
        document.getElementById('app').innerHTML = html;
    });
}

function renderScoresPage() {
    fetch('/scores/').then(response => response.text()).then(html => {
        document.getElementById('app').innerHTML = html;
    });
}

function renderNotFoundPage() {
    document.getElementById('app').innerHTML = '<h1>Page Not Found</h1>';
}

// Initialize routing
window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});
