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

const geometry = new THREE.PlaneGeometry(1, 1);

camera.position.z = 100;
camera.position.y = 30;
camera.position.x = 30;

const tile = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( 0x000000 ));

// receive data
connection.onmessage = function (event) {
    let data = JSON.parse(event.data);

    connection.close();
    let frame = 1;
    console.log(data[1])
    let animate = () => {

        requestAnimationFrame(animate);
        for (let y = 0; y < data[frame]["info.height"]; y++) {
            for (let x = 0; x < data[frame]["info.width"]; x++) {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(
                        `hsl(${(100 - parseFloat(
                        data[frame]["data_" +
                        (data[frame]["info.width"] * y + x)]
                      )) * 120 / 100},100%,70%)`
                    ),
                });
                const cube = tile.clone()
                cube.material = material
                scene.add(cube);
                cube.position.y = y + parseFloat(data[frame]["info.origin.position.y"]) / parseFloat(data[frame]["info.resolution"])
                cube.position.x = x + parseFloat(data[frame]["info.origin.position.x"]) / parseFloat(data[frame]["info.resolution"])

                // console.log(cube.position)
            }
        }

        const reticle = new THREE.SphereGeometry(0.5, 32, 16)
        const r = new THREE.Mesh(reticle, new THREE.MeshBasicMaterial( {color: 0x000000} ));
        scene.add(r)
        r.position.y = parseFloat(data[frame]["info.origin.position.y"]) / parseFloat(data[frame]["info.resolution"]) + 30
        r.position.x = parseFloat(data[frame]["info.origin.position.x"]) / parseFloat(data[frame]["info.resolution"]) + 30

        renderer.render(scene, camera);
        while (scene.children.length)
        {
            scene.remove(scene.children[0]);
        }
        frame++
        if (frame > 208) frame = 1
    };
    animate()
};
