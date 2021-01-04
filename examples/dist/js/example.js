$(function () {
    var $app = $('#app');
    Eta.configure({
        async: true,
    });
    $.when(
            $.get('templates/layout.html'),
            $.get('templates/sidebar_left.html'),
            $.get('templates/sidebar_right.html'),
            $.get('templates/content.html'),
            $.get('templates/topbar.html'),
            $.get('templates/footer.html')
        )
        .done(async function (layout, sbLeft, sbRight, content, topBar, footer) {
            Eta.templates.define('sidebar-left', Eta.compile(sbLeft[0]));
            Eta.templates.define('sidebar-right', Eta.compile(sbRight[0]));
            Eta.templates.define('content', Eta.compile(content[0]));
            Eta.templates.define('topbar', Eta.compile(topBar[0]));
            Eta.templates.define('footer', Eta.compile(footer[0]));
            $app.html(await Eta.render(layout[0]));
        });
});