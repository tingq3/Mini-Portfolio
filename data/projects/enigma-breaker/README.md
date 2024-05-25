# Enigma Machine Breaker

A computer program that is capable of emulating an enigma machine, and of
breaking the enigma cipher using brute-force methods. I programmed it as a
major project for
[UNSW's COMP6841 "Extended Security Engineering" course](https://www.handbook.unsw.edu.au/postgraduate/courses/2023/COMP6841).

The Enigma cipher was a complex cipher used by Germany in World War 2 to
encipher classified information so that it could be sent through the air
"safely". Alphabetic messages were encoded using an
[Enigma machine](https://en.wikipedia.org/wiki/Enigma_machine), which had
over 150 trillion possible keys. This massive complexity was due to a number of
components integrated into the machine:

* A plug board where up to 10 plugs can be inserted to swap letters.
* 3 rotors with a complex stepping pattern, meaning that the encoded letter
  changes with each keypress, with sequence repetition only happening after
  17000 characters.
* A reflector which maps all letters to a different letter, before sending the
  resultant letter back through the above components in reverse.

## Emulation

My program is capable of emulating the enigma machine perfectly, with a modular
design allowing for even more complex configurations (for example using a
theoretically unlimited number of rotors).

```bash
$ # Encipher using reflector B, and 3 rotors (V starting at position X, I
$ # starting at position C, and II starting at position B)
$ enigma encipher B -r V:X I:C II:B
Hello, world! This is my super cool Enigma machine, programmed in Rust!
Jtdvt, zndgl! Jrvr cq ik ydkqk qmws Nxxxtx sylgzjn, kmfwdmfwcv gc Iqcx!
```

Due to the design of the machine, its ciphers are self-reciprocal, meaning that
using the same key used to encipher text will produce the deciphered text. As
such, we can decipher the above message by using the same configuration.

```bash
$ enigma encipher B -r V:X I:C II:B
Jtdvt, zndgl! Jrvr cq ik ydkqk qmws Nxxxtx sylgzjn, kmfwdmfwcv gc Iqcx!
Hello, world! This is my super cool Enigma machine, programmed in Rust!
```

## Brute-force deciphering

My approach for brute-force deciphering is loosely based on security flaws,
associated with the German use of the Enigma machine in World War 2.

### Providing known information

In order to run a brute-force decipher, users need to specify all known
information, using an `_` underscore to represent unknown information. In
World War 2, Germans often reused the majority of their key for a full day, so
any known parts of the key can be provided to the brute force function,
reducing the work it needs to perform.

### Specifying message contents

Another historical security flaw from World War 2 was the Germans' inclusion of
common repeated phrases such as greetings. Users of my program can specify
known `--msg-start`, `--msg-end` and `--msg-contains` values, which are used to
narrow down the search patterns.

```bash
$ enigma force _ -r _ _ _ --msg-start Hello
Jtdvt, zndgl! Jrvr cq ik ydkqk qmws Nxxxtx sylgzjn, kmfwdmfwcv gc Iqcx!
Done! Found 2 matches
1 :: A --rotor-ids III:I V:R III:D
Hello, tipwh! Tned lc wv noegz tfyo Apdlih djpmfgf, hylfkogiqw wn Mcbj!

2 :: B --rotor-ids V:X I:C II:B
Hello, world! This is my super cool Enigma machine, programmed in Rust!
```
