// JavaScript should be written in ECMAScript 5.1.

const applicationIdentifierCategories = {

  'ide': [
    '^com\\.jetbrains\\.',
    '^com\\.microsoft\\.VSCode$',
  ],

  'remote-virtual': [
    '^com\\.microsoft\\.rdc$',
    '^com\\.microsoft\\.rdc\\.mac$',
    '^com\\.microsoft\\.rdc\\.macos$',
    '^com\\.microsoft\\.rdc\\.osx\\.beta$',
    '^net\\.sf\\.cord$',
    '^com\\.thinomenon\\.RemoteDesktopConnection$',
    '^com\\.itap-mobile\\.qmote$',
    '^com\\.nulana\\.remotixmac$',
    '^com\\.p5sys\\.jump\\.mac\\.viewer$',
    '^com\\.p5sys\\.jump\\.mac\\.viewer\\.web$',
    '^com\\.teamviewer\\.TeamViewer$',
    '^com\\.vmware\\.horizon$',
    '^com\\.2X\\.Client\\.Mac$',
    '^com\\.vmware\\.fusion$',
    '^com\\.vmware\\.horizon$',
    '^com\\.vmware\\.view$',
    '^com\\.parallels\\.desktop$',
    '^com\\.parallels\\.vm$',
    '^com\\.parallels\\.desktop\\.console$',
    '^org\\.virtualbox\\.app\\.VirtualBoxVM$',
    '^com\\.citrix\\.XenAppViewer$',
    '^com\\.vmware\\.proxyApp\\.',
    '^com\\.parallels\\.winapp\\.',
    '^tv\\.parsec\\.www$',
  ],

  'terminal': [
    '^org\\.macports\\.X11$',
    '^com\\.apple\\.Terminal$',
    '^com\\.googlecode\\.iterm2$',
    '^co\\.zeit\\.hyperterm$',
    '^co\\.zeit\\.hyper$',
    '^io\\.alacritty$',
    '^net\\.kovidgoyal\\.kitty$',
    '^com\\.github\\.wez\\.wezterm$'
  ],

  'browser': [
    '^org\\.mozilla\\.firefox$',
    '^org\\.mozilla\\.firefoxdeveloperedition$',
    '^org\\.mozilla\\.nightly$',
    '^com\\.microsoft\\.Edge',
    '^com\\.google\\.Chrome$',
    '^com\\.brave\\.Browser$',
    '^com\\.apple\\.Safari$',
  ],

  'cant-tab': [
    '^org\\.macports\\.X11$',
    '^co\\.zeit\\.hyper$',
  ],

  'can-reload': [
    '^com\\.tinyapp\\.TablePlus$',
    '^com\\.sequel-ace\\.sequel-ace$',
    '^co\\.zeit\\.hyper$',
  ],

}

function appsByCategories(categories) {
  return [].concat.apply(
    [],
    categories.map(function (category) {
      return applicationIdentifierCategories[category]
    })
  );
}

function buildAppCondition(app_categories, type) {
  return {
    type: type || 'frontmost_application_unless',
    bundle_identifiers: appsByCategories(app_categories),
  }
}

function buildManipulator(input_key_code, input_modifier, output_key_code, output_modifier, conditions) {
  const manipulator = {
    type: 'basic',
    from: {
      key_code: input_key_code,
      modifiers: {
        mandatory: input_modifier,
        optional: ['any'],
      },
    },
    to: [
      {
        key_code: output_key_code,
        modifiers: output_modifier,
      },
    ],
  };

  if (conditions) {
    manipulator['conditions'] = conditions
  }

  return manipulator;
}

console.log(
  JSON.stringify(
    {
      title: 'Windows Linux Shortcuts',
      maintainers: ['garhbod'],
      rules: [
        {
          description: 'Cut/Copy/Paste: Ctrl + X/C/V => Cmd + X/C/V',
          manipulators: [
            buildManipulator('c', ['control'], 'c', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('v', ['control'], 'v', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('x', ['control'], 'x', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
          ],
        },
        {
          description: 'Undo: Ctrl + Z => Cmd + Z',
          manipulators: [
            // The character key code of Z is {"key_code":"y"} for German input source.
            buildManipulator(
              'y',
              ['control'],
              'z',
              ['left_command'],
              [
                { input_sources: [{ language: '^de$' }], type: 'input_source_if' },
                buildAppCondition(['ide', 'remote-virtual', 'terminal'])
              ]
            ),
            // For other input sources.
            buildManipulator(
              'z',
              ['control'],
              'z',
              ['left_command'],
              [
                { input_sources: [{ language: '^de$' }], type: 'input_source_unless' },
                buildAppCondition(['ide', 'remote-virtual', 'terminal'])
              ]
            ),
          ],
        },
        {
          description: 'Redo: Ctrl + Y => Cmd + Shift + Z',
          manipulators: [
            // The character key code of Y is {"key_code":"z"} for German input source.
            // The character key code of Z is {"key_code":"y"} for German input source.
            buildManipulator(
              'z',
              ['control'],
              'y',
              ['left_command', 'left_shift'],
              [
                { input_sources: [{ language: '^de$' }], type: 'input_source_if' },
                buildAppCondition(['ide', 'remote-virtual', 'terminal'])
              ]
            ),
            // For other input sources.
            buildManipulator(
              'y',
              ['control'],
              'y',
              ['left_command', 'left_shift'],
              [
                { input_sources: [{ language: '^de$' }], type: 'input_source_unless' },
                buildAppCondition(['ide', 'remote-virtual', 'terminal'])
              ]
            ),
          ],
        },
        {
          description: 'Select All: Ctrl + A => Cmd + A',
          manipulators: [
            buildManipulator('a', ['control'], 'a', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
          ],
        },
        {
          description: 'New/Save/Open/Close: Ctrl + N/S/O/W => Cmd + N/S/O/W',
          manipulators: [
            buildManipulator('n', ['control'], 'n', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('s', ['control'], 's', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('o', ['control'], 'o', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('w', ['control'], 'w', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
          ],
        },
        {
          description: 'Find/Find Next|Go To: Ctrl + F/G => Cmd + F/G',
          manipulators: [
            buildManipulator('f', ['control'], 'f', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('g', ['control'], 'g', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
          ],
        },
        {
          description: 'Exit Application|Quit: Alt + F4 => Cmd + Q',
          manipulators: [
            buildManipulator('f4', ['option'], 'q', ['left_command'], [buildAppCondition(['ide', 'remote-virtual'])]),
          ],
        },
        {
          description: 'New Tab: Ctrl + T => Cmd + T',
          manipulators: [
            buildManipulator('t', ['control'], 't', ['left_command'], [buildAppCondition(['ide', 'remote-virtual'])]),
          ],
        },
        {
          description: 'Bold/Italic/Underline: Ctrl + B/I/U => Cmd + B/I/U',
          manipulators: [
            buildManipulator('b', ['control'], 'b', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('i', ['control'], 'i', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
            buildManipulator('u', ['control'], 'u', ['left_command'], [buildAppCondition(['ide', 'remote-virtual', 'terminal'])]),
          ],
        },
        {
          description: 'Jump to Address Bar: Ctrl + L => Cmd + L',
          manipulators: [
            buildManipulator('l', ['control'], 'l', ['left_command'], [buildAppCondition(['browser'], 'frontmost_application_if')]),
          ],
        },
        {
          description: 'Reload: F5 | Ctrl + R => Cmd + R',
          manipulators: [
            buildManipulator('r', ['control'], 'r', ['left_command'], [buildAppCondition(['browser', 'can-reload'], 'frontmost_application_if')]),
            buildManipulator('f5', [], 'r', ['left_command'], [buildAppCondition(['browser', 'can-reload'], 'frontmost_application_if')]),
          ],
        },
        {
          description: 'Cursor Navigation: Home, End, Arrow Jumps, etc',
          manipulators: [
            // Move cursor to beginning of line
            buildManipulator('home', [], 'left_arrow', ['left_command'], [buildAppCondition(['ide', 'remote-virtual'])]),
            // Move cursor to beginning of file
            buildManipulator('home', ['control'], 'up_arrow', ['left_command'], [buildAppCondition(['ide', 'remote-virtual'])]),
            // Move cursor to end of line
            buildManipulator('end', [], 'right_arrow', ['left_command'], [buildAppCondition(['ide', 'remote-virtual'])]),
            // Move cursor to end of file
            buildManipulator('end', ['control'], 'down_arrow', ['left_command'], [buildAppCondition(['ide', 'remote-virtual'])]),
            // Move cursor one word to the left
            buildManipulator('left_arrow', ['control'], 'left_arrow', ['left_option'], [buildAppCondition(['ide', 'remote-virtual'])]),
            // Move cursor one word to the right
            buildManipulator('right_arrow', ['control'], 'right_arrow', ['left_option'], [buildAppCondition(['ide', 'remote-virtual'])]),
          ],
        },
        {
          description: 'Lock Computer: Cmd + L => Ctrl + Cmd + Q',
          manipulators: [
            buildManipulator('l', ['command'], 'q', ['left_control', 'left_command']),
          ],
        },
        {
          description: 'Lock Computer (Alternate): Alt + L => Ctrl + Cmd + Q',
          manipulators: [
            buildManipulator('l', ['option'], 'q', ['left_control', 'left_command']),
          ],
        },
      ],
    },
    null,
    '  '
  )
)
