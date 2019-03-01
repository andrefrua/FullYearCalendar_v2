TPC:
  - Check CSS custom to be able to override them without issues
  - BEM - Methodology - CSS

  - Make some validations, for example, missing public arguments that are required.
  - remove getters / setters where not necessary, for example calendar
  - Change Documentation object types to the actual object types. Use Alias instead of name in the JS Doc
  - Install jsdoc to check if the documentation is ok. And check the View Model jsdoc config object.
  - Remove DOM day elements from the DOM and move everytjin into the VM.

  - Improve the build process, at this point I have to maintain two examples folders, one using the built code and
    another with the pre built code.

OLD:
  - Add Babel to enabled the possibility to use Arrow functions and other ES6 features. - DONE
  - Add prettier extension. - DONE
  - Change to two spaces. - DONE
  - Change the current code to use ES6 features. - DONE
  - Rename redundant variable names on the Calendar.js file. `calendarVM` and `calendarDom`. - DONE

Bugs / Issues:
  - Added drag selection - still buggy
  - Legends aren't being updated when adding new customDates
  - I believe that the selectedDays shouldn't have a different list, instead the days should have a property saying if they are selected or not.


Questions / Doubts:


Naming convention
- Abrev. -
- DOM    - Dom
- Id.    -
- BI     -
- JS     - J
