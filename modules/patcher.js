// A Patch framework for FreeExecutor
class PatcherInstance {
  constructor(config = {}) {
  	this.patches = [];
		this.clearPatchesOnApply = config.clearPatchesOnApply || true;
  }

  installPatch(execFunc) {
    if (typeof execFunc === 'function') {
      this.patches.push(execFunc);
    } else {
      this.patches.push(new Function(execFunc));
    }
  }

  applyPatches() {
    const ln = this.patches.length;
    for (let i = 0; i < ln; i++) {
      this.patches[i](); // Execute patch      
    }

    console.log(`@patcherinstance: Loaded ${ln} patches`);
		if (this.clearPatchesOnApply) {
			this.patches = [];
		}
  }

	get patchCount() {
		return this.patches.length;
	}
}

// Export
export { PatcherInstance }