class Pity {
    constructor(max) {
        this._current = 0;
        this._max = max;
    }
    get max() {
        return this._max;
    }
    get current() {
        return this._current;
    }
    set current(newCurrent) {
        this._current = Math.min(newCurrent, this._max);
    }
    increase() {
        this._current++;
    }
    check() {
        return this._current >= this._max;
    }
    reset() {
        this._current = 0;
    }
}
Pity.NULL = new Pity(0);
Pity.White_Mon = new Pity(7);
Pity.White_Duo = new Pity(8);
Pity.White_Tri = new Pity(12);
Pity.White_Tet = new Pity(35);
Pity.Blackstar_Mon = new Pity(6);
Pity.Blackstar_Duo = new Pity(8);
Pity.Blackstar_Tri = new Pity(25);
Pity.Blackstar_Tet = new Pity(40);
export default Pity;
