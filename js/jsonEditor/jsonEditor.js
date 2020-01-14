// This is the starting value for the editor
// We will use this to seed the initial editor
// and to provide a "Restore to Default" button.
var starting_value = [
    {
        "title": "Meeting in Kiel",
        "terminuses": [
            {
                "name": "Jinki"
            },
            {
                "name": "Thomas"
            },
            {
                "name": "Michael"
            },
            {
                "name": "Fabienne"
            },
            {
                "name": "Michael's office"
            },
            {
                "name": "office at Kiel"
            }
        ],
        "actions": [
            {
                "name": "drive a car"
            },
            {
                "name": "ride a bike"
            },
            {
                "name": "have a meeting"
            }
        ],
        "conditions": [
            {
                "name": "anytime"
            },
            {
                "name": "21st Jan, 2020"
            },
            {
                "name": "get to [terminus]"
            },
            {
                "name": "within two hours"
            }
        ],
        "scenario": [
            {
                "id": "step001",
                "title": "Cycling",
                "given": {"name":  "a helmet"},
                "when": {"name": "every morning"},
                "who": {"name": "Jinki"},
                "do": { "name" :"ride a bike"},
                "until": {"name": "get to the office"}
            }
        ]
    }
];

// Initialize the editor
var editor = new JSONEditor(document.getElementById('editor_holder'),{
    // Enable fetching schemas via ajax
    ajax: true,

    // The schema for the editor
    schema: {
        type: "array",
        title: "Scenario",
        format: "tabs",
        items: {
            title: "Tasc scenario",
            headerTemplate: "{{i}} - {{self.title}}",
            oneOf: [
                {
                    $ref: "./json/scheme/tasc.json",
                    title: "Tasc"
                }
            ]
        }
    },

    // Seed the form with a starting value
    startval: starting_value,

    // Disable additional properties
    no_additional_properties: true,

    // Require all properties by default
    required_by_default: true
});

// Hook up the submit button to log to the console
document.getElementById('submit').addEventListener('click',function() {
    // Get the value from the editor
    console.log(editor.getValue());
});

// Hook up the Restore to Default button
document.getElementById('restore').addEventListener('click',function() {
    editor.setValue(starting_value);
});

// Hook up the enable/disable button
document.getElementById('enable_disable').addEventListener('click',function() {
    // Enable form
    if(!editor.isEnabled()) {
        editor.enable();
    }
    // Disable form
    else {
        editor.disable();
    }
});

// Hook up the validation indicator to update its
// status whenever the editor changes
editor.on('change',function() {
    // Get an array of errors from the validator
    var errors = editor.validate();

    var indicator = document.getElementById('valid_indicator');

    // Not valid
    if(errors.length) {
        indicator.style.color = 'red';
        indicator.textContent = "not valid";
    }
    // Valid
    else {
        indicator.style.color = 'green';
        indicator.textContent = "valid";
    }
});