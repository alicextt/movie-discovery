import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
