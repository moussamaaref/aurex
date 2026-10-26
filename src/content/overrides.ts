import { applyOverrides, readStoredOverrides } from "./registry"

/** Appliqué avant le reste de l'application (import en tête de main.tsx) :
 *  les textes / images modifiés depuis /admin remplacent ceux du code, en place. */
applyOverrides(readStoredOverrides())
