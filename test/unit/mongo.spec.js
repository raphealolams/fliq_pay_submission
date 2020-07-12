const { EventEmitter } = require("events");
const mongoose = require("mongoose");
const mongo = require("../../models");
const { dbSettings, serverSettings } = require("../../config");

describe("Mongo Connection", () => {
  it("should emit db Object with an EventEmitter", (done) => {
    const mediator = new EventEmitter();
    mediator.emit("boot.ready");
    mongo.connect({ dbSettings, serverSettings, mongoose }, mediator);

    mediator.on("db.error", (err) => {
      console.log(err);
    });
    mediator.on("db.ready", (db) => {
      done();
    });

    done();
  });
});
