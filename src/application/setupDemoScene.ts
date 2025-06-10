import {
  MondlichAdapter,
  MondlichEngine,
  ParticleEffectsManager,
  Timer,
  UserInput,
  MondlichMath,
  createWebGLCanvas,
} from 'mondlich';

import { vec3 } from 'gl-matrix';

const configureRenderingContext = ({ gl, width, height }: {
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
}): void => {
  gl.viewport(0, 0, width, height);
  // gl.enable(gl.DEPTH_TEST); // this makes background bleed through png's transparent area and overlap rear particle textures somehow
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
  gl.clearColor(0, 0, 0, 1);
};

export const DEFAULT_CANVAS_SIZE = {
  width: 1920,
  height: 1080,
};

export const setupDemoScene = async (): Promise<void> => {

  const { gl, canvas } = createWebGLCanvas({
    ...DEFAULT_CANVAS_SIZE,
    containerId: 'app',
  });

  configureRenderingContext({
    gl,
    ...DEFAULT_CANVAS_SIZE,
  });

  const engine = new MondlichEngine(canvas);
  const adapter = new MondlichAdapter(engine);
  const manager = new ParticleEffectsManager(adapter);
  await manager.textureManager.loadTextureLibrary();

  engine.camera.moveEye([0, -700, -250]);
  engine.camera.moveLookAt([0, -1100, -2000]);

  const fire = manager.createFire({
    particlesCount: 20000,
    spawnFramespan: 1,
  });

  const firework = manager.createFirework({
    particlesCount: 20000,
    spawnFramespan: 1,
  });

  const fountain1 = manager.createFountain({
    particlesCount: 20000,
    spawnFramespan: 1,
  });

  const fountain2 = manager.createFountain({
    particlesCount: 20000,
    spawnFramespan: 1,
  });

  const fountain3 = manager.createFountain({
    particlesCount: 20000,
    spawnFramespan: 1,
  });

  const R_MAX = 250;
  fire.settings.origin = [0, 0, R_MAX];
  firework.settings.origin = [0, 0, -1000];
  fountain1.settings.origin = [-R_MAX * 2, 0, 0];
  fountain2.settings.origin = [R_MAX * 2, 0, 0];
  fountain3.settings.origin = [0, 0, -R_MAX * 2];

  manager.setWorkerEnabled(fire, true);
  manager.setWorkerEnabled(firework, true);
  manager.setWorkerEnabled(fountain1, true);
  manager.setWorkerEnabled(fountain2, true);

  const timer = new Timer(false);

  const T = 1; // period for one full cycle (inward + outward) in seconds
  const N = 1; // number of turns per cycle


  const updateEffectsSettings = () => {
    const t = timer.getElapsedTime();
    const u = (t % T) / T;
    const r = R_MAX * Math.abs(2 * u - 1);
    const theta = (2 * Math.PI * N / T) * t;

    fire.settings.color = vec3.fromValues(Math.random(), Math.random(), Math.random());
    fire.settings.origin = [-r * Math.sin(theta), 0, r * Math.cos(theta)];

    firework.settings.origin = MondlichMath.rotatePointAroundAxis({
      point: firework.settings.origin,
      axisOrigin: [0, 0, 0],
      axisDirection: [0, 1, 0],
      rotationAngle: t * 0.01,
    });
    firework.settings.color = vec3.fromValues(Math.random(), Math.random(), Math.random());
  };

  const userInput = new UserInput({
    camera: engine.camera,
    sensitivity: 1,
  });

  const render = (): void => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    manager.render();
  };

  timer.start();
  fire.start();
  // fire2.start();
  firework.start();
  fountain1.start();
  fountain2.start();
  fountain3.start();

  const loop = async () => {
    updateEffectsSettings();
    await manager.update();
    userInput.update();

    render();

    requestAnimationFrame(loop);
  };

  loop();
};
