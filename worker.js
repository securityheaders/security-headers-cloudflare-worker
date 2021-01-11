const securityHeaders = {
        "Content-Security-Policy": "upgrade-insecure-requests",
        "Strict-Transport-Security": "max-age=1000",        
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "accelerometer=(); camera=(); geolocation=(); gyroscope=(); magnetometer=(); microphone=(); payment=(); usb=()"
    },
    sanitiseHeaders = {
        Server: ""
    },
    removeHeaders = [
        "Public-Key-Pins",
        "X-Powered-By",
        "X-AspNet-Version"
    ];

async function addHeaders(req) {
    const response = await fetch(req),
        newHeaders = new Headers(response.headers),
        setHeaders = Object.assign({}, securityHeaders, sanitiseHeaders);

    if (newHeaders.has("Content-Type") && !newHeaders.get("Content-Type").includes("text/html")) {
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    }

    Object.keys(setHeaders).forEach(name => newHeaders.set(name, setHeaders[name]));

    removeHeaders.forEach(name => newHeaders.delete(name));

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}

addEventListener("fetch", event => event.respondWith(addHeaders(event.request)));
