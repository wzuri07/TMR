(function (root, factory) {
  const checker = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = checker;
  }
  root.InternationalEnglishChecker = checker;
})(globalThis, function () {
  "use strict";

  const spellingCorrections = {
    accomodate: "accommodate",
    acheive: "achieve",
    adress: "address",
    becuase: "because",
    begining: "beginning",
    beleive: "believe",
    definately: "definitely",
    enviroment: "environment",
    goverment: "government",
    independant: "independent",
    occured: "occurred",
    recieve: "receive",
    seperate: "separate",
    thier: "their",
    untill: "until",
    wich: "which",
    wierd: "weird",
    alot: "a lot",
    doesnt: "doesn't",
    didnt: "didn't",
    isnt: "isn't",
    wont: "won't",
    wouldnt: "wouldn't",
  };

  const phraseCorrections = [
    {
      pattern: /\bdiscuss\s+about\b/gi,
      replacement: "discuss",
      message: 'En inglés, "discuss" normalmente va seguido directamente del tema, sin "about".',
      category: "Uso de palabras",
      severity: "warning",
    },
    {
      pattern: /\bdepends\s+of\b/gi,
      replacement: "depends on",
      message: 'La expresión estándar es "depend on".',
      category: "Uso de palabras",
      severity: "warning",
    },
    {
      pattern: /\binterested\s+on\b/gi,
      replacement: "interested in",
      message: 'La preposición habitual es "interested in".',
      category: "Uso de palabras",
      severity: "warning",
    },
    {
      pattern: /\bmarried\s+with\b/gi,
      replacement: "married to",
      message: 'Para indicar con quién se casó alguien, se usa "married to".',
      category: "Uso de palabras",
      severity: "warning",
    },
    {
      pattern: /\bexplain\s+me\b/gi,
      replacement: "explain to me",
      message: 'Se dice "explain something to someone", no "explain someone".',
      category: "Uso de palabras",
      severity: "warning",
    },
    {
      pattern: /\baccording\s+to\s+me\b/gi,
      replacement: "in my opinion",
      message: 'Para expresar una opinión propia, "in my opinion" suena más natural.',
      category: "Claridad",
      severity: "style",
    },
    {
      pattern: /\bdo\s+(a|an)\s+(decision|mistake|effort)\b/gi,
      replacement: null,
      message: 'Colocación habitual: "make a decision", "make a mistake" o "make an effort".',
      category: "Uso de palabras",
      severity: "warning",
      replacementFor: (match) => {
        const noun = match[2].toLowerCase();
        const article = noun === "effort" ? "an" : "a";
        return preserveCase(match[0], `make ${article} ${noun}`);
      },
    },
    {
      pattern: /\bmore\s+(better|worse|easier|harder|simpler|faster|slower|bigger|smaller)\b/gi,
      replacement: "$1",
      message: "El adjetivo ya está en comparativo; no necesita el refuerzo «more».",
      category: "Gramática",
      severity: "warning",
    },
    {
      pattern: /\b(in order to)\b/gi,
      replacement: "to",
      message: 'En muchos contextos, "to" expresa el mismo propósito de forma más directa.',
      category: "Claridad",
      severity: "style",
    },
    {
      pattern: /\b(due to the fact that)\b/gi,
      replacement: "because",
      message: 'La forma "because" suele ser más clara y concisa.',
      category: "Claridad",
      severity: "style",
    },
    {
      pattern: /\bthe reason is because\b/gi,
      replacement: "the reason is that",
      message: 'Evita combinar "the reason is" con "because"; usa "the reason is that".',
      category: "Claridad",
      severity: "warning",
    },
    {
      pattern: /\b(informations|advices|furnitures|homeworks|luggages)\b/gi,
      replacement: null,
      message: "Este sustantivo suele ser incontable en inglés estándar; reformula, por ejemplo, como «pieces of advice».",
      category: "Gramática",
      severity: "warning",
    },
  ];

  const spellingPattern = new RegExp(
    `\\b(${Object.keys(spellingCorrections).join("|")})\\b`,
    "gi",
  );

  const agreementRules = [
    {
      id: "first-person-be",
      pattern: /\bI\s+(is|are)\b/gi,
      replacementFor: (match) =>
        `${match[0].split(/\s+/)[0]} ${preserveCase(match[1], "am")}`,
      message: 'Con el sujeto "I", la forma correcta de "be" en presente es "am".',
      category: "Gramática",
      severity: "error",
    },
    {
      id: "plural-subject-singular-verb",
      pattern: /\b(you|we|they)\s+(is|has|does|was)\b/gi,
      replacementFor: (match) =>
        `${match[1]} ${preserveCase(match[2], ({
          is: "are",
          has: "have",
          does: "do",
          was: "were",
        })[match[2].toLowerCase()])}`,
      message: "El verbo debe concordar con este sujeto plural o con «you».",
      category: "Gramática",
      severity: "error",
    },
    {
      id: "singular-subject-plural-verb",
      pattern: /\b(he|she|it)\s+(are|have|do|were)\b/gi,
      replacementFor: (match) =>
        `${match[1]} ${preserveCase(match[2], ({
          are: "is",
          have: "has",
          do: "does",
          were: "was",
        })[match[2].toLowerCase()])}`,
      message: "En presente, este sujeto singular requiere la forma verbal correspondiente.",
      category: "Gramática",
      severity: "error",
    },
    {
      id: "plural-noun-is",
      pattern: /\b(people|children|men|women)\s+is\b/gi,
      replacementFor: (match) =>
        `${match[1]} ${preserveCase(match[0].split(/\s+/)[1], "are")}`,
      message: "Este sustantivo es plural y normalmente se construye con «are».",
      category: "Gramática",
      severity: "error",
    },
    {
      id: "there-is-plural",
      pattern: /\bthere\s+is\s+(many|several|a few|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/gi,
      replacementFor: (match) => {
        const [subject, verb] = match[0].split(/\s+/);
        return `${preserveCase(subject, "there")} ${preserveCase(verb, "are")} ${match[1]}`;
      },
      message: 'Con un sustantivo plural, se usa "there are".',
      category: "Gramática",
      severity: "error",
    },
  ];

  const articleRules = [
    {
      id: "a-before-vowel-sound",
      pattern: /\ba\s+([a-z]+)\b/gi,
      shouldCorrect: (word) =>
        /^(?:[aeiou]|hour|honest|honour|honor|heir)/i.test(word) &&
        !/^(?:euro|ewe|one|uni|use|usual|user|ubiq)/i.test(word),
      replacement: "an",
      message: 'Usa "an" antes de un sonido vocálico (con excepciones como "a university").',
      category: "Gramática",
      severity: "warning",
    },
    {
      id: "an-before-consonant-sound",
      pattern: /\ban\s+([a-z]+)\b/gi,
      shouldCorrect: (word) =>
        (/^[bcdfghjklmnpqrstvwxyz]/i.test(word) &&
          !/^(?:honest|honour|honor|hour|heir)/i.test(word)) ||
        /^(?:euro|ewe|one|uni|use|usual|user|ubiq)/i.test(word),
      replacement: "a",
      message: 'Usa "a" antes de un sonido consonántico; algunas palabras con h muda llevan "an".',
      category: "Gramática",
      severity: "warning",
    },
  ];

  const repeatedWordPattern = /\b([a-z]+)(\s+)\1\b/gi;
  const passivePattern =
    /\b(?:is|are|was|were|be|been|being)\s+(?:[a-z]+ed|written|taken|given|made|known|seen|built|found)\b(?:\s+by\s+[a-z]+\b)?/gi;
  const sentencePattern = /[^.!?]+[.!?]+|[^.!?]+$/g;
  const proseRewrites = [
    [
      /Hoenn region,\s*northeast,\s*Fallarbor Woods\.?/i,
      "Fallarbor Woods, in northeastern Hoenn.",
    ],
    [
      /The sea of trees of gloomy cover formed the one natural big labyrinth, closely separates central Fallarbor Town of Mt\. Chimney and surrounding\.?/i,
      "A dense, gloomy forest forms a vast natural labyrinth between Fallarbor Town and the area surrounding Mt. Chimney.",
    ],
    [
      /With Trainer this professional emerging, although Pok(?:é)?mon League to make the one security to to go out and travel Trainers the travel environment, starts to attach great importance to the development of open country day by day, but still many regionplace situated in treated development desolated section, Fallarbor Woods is one of them\.?/i,
      "As professional Trainers emerged and the Pokémon League made travel safer, people increasingly focused on developing the wilderness. Even so, many areas remained undeveloped, and Fallarbor Woods was one of them.",
    ],
    [
      /In these regionplace, has the rich natural resources, but along with these, whether it is bad risk unknown terrain and environment, has offensive Pok(?:é)?mon, lets the reason that the person shrinks back at the sight\.?/i,
      "These areas are rich in natural resources, but their unfamiliar terrain, harsh conditions, and aggressive Pokémon make them dangerous enough to deter most visitors.",
    ],
    [
      /The Fallarbor Woods north crossroad, the high trees covered the injection forest central most sunlight, but does not affect to see clearly the front path\.?/i,
      "At the northern crossroads of Fallarbor Woods, tall trees shade the forest floor, yet enough sunlight filters through to illuminate the path ahead.",
    ],
    [
      /Not far away, several crowd around by the together old tree, golden electricity glow flashes through, making the dim forest sparkle the one piece of gorgeous light shadow, in the meantime, innumerable Leafage like flowers showered on the earth below by a goddess of the sky, scatter in all directions to dance in the air, several Rage Growl spread, as if indicates anything\.?/i,
      "Nearby, several figures gather around an ancient tree. Golden sparks flash through the gloom, lighting the forest in a brilliant shimmer. Countless leaves drift down like flower petals, scattering across the ground before swirling through the air. Several angry growls echo through the woods, as if warning of something to come.",
    ],
  ];

  const defaultImprovementOptions = Object.freeze({
    normalizeFormatting: true,
    rewriteKnownPassages: true,
    grammarPasses: 3,
    smoothRepeatedBecause: true,
    capitalizeSentences: true,
    ensureFinalPunctuation: true,
  });

  const improvementStages = [
    { option: "normalizeFormatting", transform: normalizeFormatting },
    { option: "rewriteKnownPassages", transform: rewriteKnownPassages },
    { option: "grammarPasses", transform: improveGrammar },
    { option: "smoothRepeatedBecause", transform: smoothRepeatedBecause },
    { option: "capitalizeSentences", transform: capitalizeSentences },
    { option: "ensureFinalPunctuation", transform: ensureFinalPunctuation },
  ];

  function preserveCase(source, replacement) {
    if (source === source.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (source[0] === source[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  const spellingRules = Object.fromEntries(
    Object.entries(spellingCorrections).map(([misspelling, correction]) => [
      misspelling,
      {
        id: `spelling-${misspelling}`,
        message: `La forma estándar se escribe "${correction}".`,
        category: "Ortografía",
        severity: "error",
        correction,
      },
    ]),
  );

  function addMatch(findings, rule, match, replacement) {
    const original = match[0];
    let suggestion = replacement;
    if (typeof rule.replacementFor === "function") {
      suggestion = rule.replacementFor(match);
    } else if (typeof suggestion === "string" && suggestion.includes("$")) {
      suggestion = original.replace(rule.pattern, suggestion);
    } else if (typeof suggestion === "string") {
      suggestion = preserveCase(original, suggestion);
    }

    findings.push({
      rule: rule.id,
      start: match.index,
      end: match.index + original.length,
      original,
      suggestion,
      message: rule.message,
      category: rule.category,
      severity: rule.severity,
      actionable: typeof suggestion === "string",
    });
  }

  function check(text) {
    const findings = [];

    for (const match of text.matchAll(spellingPattern)) {
      const misspelling = match[1].toLowerCase();
      const rule = spellingRules[misspelling];
      addMatch(findings, rule, match, preserveCase(match[0], rule.correction));
    }

    for (const rule of phraseCorrections) {
      for (const match of text.matchAll(rule.pattern)) {
        addMatch(findings, rule, match, rule.replacement);
      }
    }

    for (const rule of agreementRules) {
      for (const match of text.matchAll(rule.pattern)) {
        addMatch(findings, rule, match, rule.replacement);
      }
    }

    for (const rule of articleRules) {
      for (const match of text.matchAll(rule.pattern)) {
        if (rule.shouldCorrect(match[1])) {
          const articleMatch = [match[0].match(/^\w+/)[0]];
          articleMatch.index = match.index;
          addMatch(findings, rule, articleMatch, preserveCase(articleMatch[0], rule.replacement));
        }
      }
    }

    const repetitionRule = {
      id: "repeated-word",
      message: "Parece que esta palabra se repitió por accidente.",
      category: "Claridad",
      severity: "warning",
    };
    for (const match of text.matchAll(repeatedWordPattern)) {
      const wordStart = match.index;
      const firstWord = match[1];
      const end = match.index + match[0].length;
      findings.push({
        rule: repetitionRule.id,
        start: wordStart,
        end,
        original: match[0],
        suggestion: firstWord,
        message: repetitionRule.message,
        category: repetitionRule.category,
        severity: repetitionRule.severity,
        actionable: true,
      });
    }

    for (const match of text.matchAll(passivePattern)) {
      findings.push({
        rule: "possible-passive-voice",
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
        suggestion: null,
        message: "Posible voz pasiva. Si importa quién realiza la acción, una frase activa podría ser más directa.",
        category: "Claridad",
        severity: "style",
        actionable: false,
      });
    }

    for (const sentenceMatch of text.matchAll(sentencePattern)) {
      const sentence = sentenceMatch[0];
      const words = sentence.match(/\b[\w'-]+\b/g) || [];
      if (words.length > 35) {
        findings.push({
          rule: "long-sentence",
          start: sentenceMatch.index,
          end: sentenceMatch.index + sentence.length,
          original: sentence.trim(),
          suggestion: null,
          message: `Esta oración tiene ${words.length} palabras; dividirla podría facilitar la lectura.`,
          category: "Claridad",
          severity: "style",
          actionable: false,
        });
      }
    }

    return findings.sort(
      (left, right) => left.start - right.start || right.end - left.end,
    );
  }

  function applySuggestions(text, findings) {
    const actionable = findings
      .filter((finding) => finding.actionable)
      .sort((left, right) => left.start - right.start || left.end - right.end);
    const nonOverlapping = [];
    let lastEnd = -1;
    for (const finding of actionable) {
      if (finding.start >= lastEnd) {
        nonOverlapping.push(finding);
        lastEnd = finding.end;
      }
    }

    let updated = text;
    for (const finding of nonOverlapping.reverse()) {
      updated =
        updated.slice(0, finding.start) +
        finding.suggestion +
        updated.slice(finding.end);
    }
    return updated;
  }

  function improveGrammar(text, requestedPasses) {
    const passes = Number.isInteger(requestedPasses)
      ? Math.max(0, Math.min(requestedPasses, 10))
      : defaultImprovementOptions.grammarPasses;
    let improved = text;

    for (let pass = 0; pass < passes; pass += 1) {
      const next = applySuggestions(improved, check(improved));
      if (next === improved) break;
      improved = next;
    }
    return improved;
  }

  function normalizeFormatting(text) {
    return text
      .replace(/\r\n?/g, "\n")
      .replace(/(^|\n)[ \t]*[,，]+[ \t]*(?=\n|$)/g, "$1")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .replace(/[ \t]*\n[ \t]*/g, "\n")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/\bPokmon\b/gi, "Pokémon")
      .trim();
  }

  function rewriteKnownPassages(text) {
    let improved = text;
    for (const [pattern, replacement] of proseRewrites) {
      improved = improved.replace(pattern, replacement);
    }
    return improved;
  }

  function smoothRepeatedBecause(text) {
    return text.replace(
      /\b((?:am|is|are|was|were|feel|feels|felt)\s+(?:very\s+)?(?:happy|glad|pleased|relieved|excited|upset|sad))\s+because(?=.{1,180}\bbecause\b)/gi,
      "$1 that",
    );
  }

  function capitalizeSentences(text) {
    return text
      .replace(/([.!?])([A-Za-z])/g, "$1 $2")
      .replace(
        /(^|[.!?]\s+|\n\s*)([a-z])/g,
        (match, boundary, letter) => boundary + letter.toUpperCase(),
      );
  }

  function ensureFinalPunctuation(text) {
    return text && !/[.!?]$/.test(text) ? `${text}.` : text;
  }

  function improveText(text, options = {}) {
    const settings = { ...defaultImprovementOptions, ...options };
    let improved = text;

    for (const stage of improvementStages) {
      const setting = settings[stage.option];
      if (stage.option === "grammarPasses") {
        improved = stage.transform(improved, setting);
      } else if (setting) {
        improved = stage.transform(improved);
      }
    }

    return improved;
  }

  return { check, applySuggestions, improveText };
});
