# TMR — Translator Machine-Reader

## Clear English: corrector de inglés internacional

Aplicación web ligera para revisar gramática y mejorar la legibilidad de textos
en inglés. Funciona en el navegador, no requiere instalación y procesa el texto
localmente, sin enviarlo a un servidor.

### Funciones

- Corrección de errores frecuentes de ortografía, gramática y uso de palabras.
- Mejora de formato, claridad y algunas frases conocidas.
- Texto de demostración de Fallarbor Woods y área de texto para documentos de
  una o más páginas.
- Tema claro y oscuro, con preferencia recordada en el navegador.
- Sin dependencias de ejecución ni servicios externos.

## Uso

1. Abre `index.html` con doble clic.
2. Escribe o pega el texto en inglés.
3. Pulsa **Mejorar y reemplazar texto** para aplicar las correcciones
   automáticas directamente en el cuadro grande. El resultado sustituye allí
   mismo el texto original.
4. Pulsa **Revisar sugerencias** si quieres ver las observaciones sin modificar
   el texto; luego puedes aplicar cada sugerencia individualmente.
5. **Probar con un ejemplo** carga el pasaje de Fallarbor Woods; **Mejorar y
   reemplazar texto** lo convierte y pone el resultado en el mismo cuadro.
6. Usa el botón con la luna/sol en la barra superior para alternar entre tema
   claro y oscuro. La preferencia queda guardada en este navegador.

## Alcance y privacidad

El corrector identifica errores frecuentes de concordancia, algunos errores de
artículos, palabras mal escritas, expresiones poco naturales, redundancias y
posibles problemas de claridad. Evita imponer grafías exclusivamente
estadounidenses o británicas para ser útil en contextos de inglés internacional.

La revisión y mejora son heurísticas: corrigen patrones frecuentes, limpian
formato y simplifican algunas expresiones, pero no comprenden cualquier contexto
como una persona. Las observaciones de claridad (por ejemplo, voz pasiva) son
sugerencias, no errores confirmados. Comprueba que el resultado conserve el
significado y el tono que buscas; no sustituye una revisión humana ni un
corrector lingüístico exhaustivo.

El cuadro de texto no tiene un límite de longitud impuesto por la aplicación.
La calidad de la reescritura puede variar según el tema y el contexto.

## Publicar con GitHub Pages

Cuando el repositorio esté en GitHub, abre **Settings → Pages**, selecciona
**Deploy from a branch**, elige `main` y la carpeta raíz (`/`). Guarda los
cambios; GitHub Pages publicará `index.html` y la aplicación estará disponible
como sitio web estático.

## Ampliar el programa

- Las correcciones se agrupan por tipo en `checker.js`: añade reglas de
  concordancia, artículos, frases u ortografía junto a las reglas de su tipo.
- La mejora se ejecuta mediante etapas con opciones: `normalizeFormatting`,
  `rewriteKnownPassages`, `grammarPasses`, `smoothRepeatedBecause`,
  `capitalizeSentences` y `ensureFinalPunctuation`. Se pueden activar o
  desactivar por llamada, por ejemplo:
  `improveText(text, { rewriteKnownPassages: false })`.
- Los textos de demostración viven aparte en `examples.js`, para poder agregar
  nuevos ejemplos sin mezclar contenido con la interfaz.

## Pruebas

Con Node.js instalado, ejecuta `npm test` en esta carpeta. Node solo se usa para
las pruebas: la aplicación funciona directamente en el navegador sin Node.
