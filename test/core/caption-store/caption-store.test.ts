import { describe, it, expect } from "vitest"
import { storage } from "uxp"
import { resolve } from "node:path"
import { captionStore } from "@core/caption-store"
import { DuplicateIdError } from "@core/caption-file"

const makeFile = (name: string) =>
    new storage.File(resolve(import.meta.dirname, name));

describe("init()", () => {
    it("throws when invalid json", async () => {
        await expect(captionStore.init(makeFile("invalid.json"))).rejects.toThrow()
    })

    it("throws when caption file does not match schema", async () => {
        await expect(captionStore.init(makeFile("no-match.json"))).rejects.toThrow()
    })

    it("accepts a valid json (1)", async () => {
        await expect(captionStore.init(makeFile("valid-1.json"))).resolves.not.toThrow()
    })

    it("accepts a valid json (2)", async () => {
        await expect(captionStore.init(makeFile("valid-2.json"))).resolves.not.toThrow()
    })

    it("accepts a valid json (3)", async () => {
        await expect(captionStore.init(makeFile("valid-3.json"))).resolves.not.toThrow()
    })

    it("throws DuplicateIdError when caption ids are not unique", async () => {
        await expect(captionStore.init(makeFile("duplicate-ids.json"))).rejects.toThrow(DuplicateIdError)
    })
})