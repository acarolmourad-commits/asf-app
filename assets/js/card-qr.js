/* Build the verification QR locally. Four light modules surround every edge. */
function asfCardQrCanvas(verificationUrl) {
  const code = qrcode(0, 'M');
  code.addData(verificationUrl);
  code.make();
  const modules = code.getModuleCount();
  const scale = 6;
  const margin = 4;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = (modules + 2 * margin) * scale;
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#102d45';
  for (let row = 0; row < modules; row++) {
    for (let column = 0; column < modules; column++) {
      if (code.isDark(row, column)) {
        context.fillRect((column + margin) * scale, (row + margin) * scale, scale, scale);
      }
    }
  }
  return canvas;
}
