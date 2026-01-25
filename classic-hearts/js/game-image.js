// Hearts
// Copyright (c) 2019 Jason Pickart aka badger2013
// License: MIT
// Contact: pickart.jason@gmail.com
// Source: https://bitbucket.org/jpickart/classic-hearts/src

function GameImage() {
    /**
     * @type {HTMLImageElement}
     */
    this.element = null;
    /**
     * @type {number}
     */
    this.x = 0;
    /**
     * @type {number}
     */
    this.y = 0;
    /**
     * @type {number}
     */
    this.width = 0;
    /**
     * @type {number}
     */
    this.height = 0;
    /**
     * @type {string}
     */
    this.id = null;
    /**
     * @type {boolean}
     */
    this.loading = false;
    /**
     * @type {boolean}
     */
    this.loaded = false;
    /**
     * @type {string}
     */
    this.description = null;
    /**
     * @type {boolean}
     */
    this.selected = false;
    this.image = null;
}
