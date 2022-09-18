precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform float offset;
uniform float random;
uniform vec2 cursor;
uniform bool mouseDown;
uniform sampler2D texture;

vec2 rand2(vec2 x) {
    return fract(sin(vec2(dot(x, vec2(13.9898, 8.141)), dot(x, vec2(3.4562, 17.398)))) * 43758.5453 * ((1.0 + random) * 10.0));
}

vec4 voronoi(vec2 uv, vec2 size) {
    uv *= size;
    float best_distance0 = 1.0;
    float best_distance1 = 1.0;
    vec2 point0;
    vec2 point1;
    vec2 p0 = floor(uv);
    for(int dx = -1; dx < 2; ++dx) {
        for(int dy = -1; dy < 2; ++dy) {
            vec2 d = vec2(dx, dy);
            vec2 p = p0 + d;
            p += rand2(mod(p, size));
            float distance = length((uv - p) / size);
            if(best_distance0 > distance) {
                best_distance1 = best_distance0;
                best_distance0 = distance;
                point1 = point0;
                point0 = p;
            } else if(best_distance1 > distance) {
                best_distance1 = distance;
                point1 = p;
            }
        }
    }
    float edge_distance = dot(uv - 0.5 * (point0 + point1), normalize(point0 - point1));

    return vec4(point0, best_distance0 * length(size), edge_distance);
}

float mapRange(float value, float low1, float high1, float low2, float high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution);
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    float s = 10.0;
    float oS = 0.05;
    vec2 pointColor = rand2(voronoi(uv, vec2(s)).xy / s);
    vec2 multiplied = pointColor * oS;
    vec2 offset = uv + multiplied.xy;

    color.xyzw = texture2D(texture, offset);

    float threshold = 0.01;
    float multiplier = 1.8;
    float edgedist = voronoi(uv, vec2(s)).w;
    if (edgedist < threshold) {
        color.xyz = vec3(mapRange(edgedist, threshold, 0.0, 0.0, 1.0) * multiplier);
    }

    // color.w = 1.0;
    // color.xyzw = texture2D(texture, uv);
    gl_FragColor = color;
}