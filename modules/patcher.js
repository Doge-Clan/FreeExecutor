// A Patch framework for FreeExecutor
class PatcherInstance {
  constructor() {
  	this.patches = [];
  }

  installPatch(execFunc) {
    this.patches.push(execFunc);
  }

  applyPatches() {
    const ln = this.patches.length;
    for (let i = 0; i < ln; i++) {
      this.patches[i](); // Execute patch      
    }

    console.log(`@patcherinstance: Loaded ${ln} patches`)
  }

	get patchCount() {
		return this.patches.length;
	}
}

// Export
export { PatcherInstance }