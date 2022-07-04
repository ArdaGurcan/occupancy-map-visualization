// https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket
// MDN websocket

console.log("start");
// The protocol identifier is ws
var connection = new WebSocket("ws://localhost:8765/");
// send data
connection.onopen = function () {
    connection.send("I need data!");
};

console.log("end");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);

camera.position.z = 50;
camera.position.y = 30;
camera.position.x = 30;

// receive data
connection.onmessage = function (event) {
    let data = JSON.parse(event.data);
    connection.close();
    let frame = 1;
    let animate = () => {

        requestAnimationFrame(animate);
        for (let y = 0; y < data[frame]["info.height"]; y++) {
            for (let x = 0; x < data[frame]["info.width"]; x++) {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(
                        "hsl(" +
                            (
                                (100 -parseInt(
                                    data[frame][
                                        "data_" +
                                            (data[frame]["info.width"] * y + x)
                                    ]
                                )) * 120/100 ) +
                            ",100%,70%)"
                    ),
                });
                const cube = new THREE.Mesh(geometry, material);
                scene.add(cube);
                cube.position.y = y;
                cube.position.x = x;
            }
        }

        renderer.render(scene, camera);
        frame++
        if (frame > 210) frame = 1
    };
    animate()
};
