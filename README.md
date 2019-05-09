# unirand.js
generate random integers uniformly from any specified range

## What?
JavaScript does not provide any way to generate random integers uniformly from a custom range. Existing sources of random numbers, like `Math.random()` or `crypto.getRandomValues()` provide random numbers from uniformly random bits, but this does not easily translate to other ranges, like choosing a random integer between 1 and 10, where all integers are equally likely.

## Why?

There are applications where it is important to avoid any bias in generation of random numbers&mdash;like games, gambling, or security-related applications.

## How?
