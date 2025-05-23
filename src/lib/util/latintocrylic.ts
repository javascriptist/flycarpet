function toCyrillic(text: string): string {
  const map: { [key: string]: string } = {
    A: 'А', a: 'а',
    B: 'Б', b: 'б',
    V: 'В', v: 'в',
    G: 'Г', g: 'г',
    D: 'Д', d: 'д',
    E: 'Е', e: 'е',
    Z: 'З', z: 'з',
    I: 'И', i: 'и',
    J: 'Й', j: 'й',
    K: 'К', k: 'к',
    L: 'Л', l: 'л',
    M: 'М', m: 'м',
    N: 'Н', n: 'н',
    O: 'О', o: 'о',
    P: 'П', p: 'п',
    R: 'Р', r: 'р',
    S: 'С', s: 'с',
    T: 'Т', t: 'т',
    U: 'У', u: 'у',
    F: 'Ф', f: 'ф',
    H: 'Х', h: 'х',
    C: 'Ц', c: 'ц',
    Y: 'Ы', y: 'ы',
    X: 'Кс', x: 'кс',
    Q: 'К', q: 'к',
    W: 'В', w: 'в',
  };

  return text.split('').map((char) => map[char] || char).join('');
}

export default toCyrillic;