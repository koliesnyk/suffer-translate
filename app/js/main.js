$(document).ready(function () {
  $(".generate-code").click(function (e) {
    e.preventDefault();

    generateCode();
  });

  $(document).on("click", ".remove", function (e) {
    e.preventDefault();

    $(this).parent().remove();
  });

  $(".add-fields").click(function (e) {
    e.preventDefault();

    addField();
  });
});

function addField() {
  var fields = `
    <div class="fieldset">
      <input type="text" name="text" placeholder="Enter Text" />
      <input type="text" name="translation" placeholder="Enter Translation" />
      <button class="remove">Remove</button>
    </div>
  `;

  $(".fields").append(fields);
}

function createGuid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
  }

  var newGuid = _p8() + _p8(true) + _p8(true) + _p8();

  return newGuid.toUpperCase();
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

function generateCode() {
  var result = "";
  var fieldResults = "";

  var className = $("input[name=class-name]").val();
  var classNameClear = className.replace(/[^A-Z0-9]/gi, "");

  $(".fields .fieldset").each(function (index) {
    var text = $(this).find("input[name=text]").val();
    var translation = $(this).find("input[name=translation]").val();
    var stringName = titleCase(text).replace(/[^A-Z0-9]/gi, "");

    fieldResults += `
      [Ordinal(${index + 1})]
      [ID("{${createGuid()}}")]
      [Caption("${text} Text Caption")]
      [Access(AccessLevel.System)]
      public MetaStoreString ${stringName}Caption { get; set; } = new("${text}", ("${translation}", "de-DE"));
    `;
  });

  result = `
    public class ${classNameClear}Info : MetaStoreContainer
    {
      ${fieldResults}
      public override async ValueTask<OpResult> InitializeNodeAsync(IMetaStoreContext context, bool forceInit = false)
      {
        await base.InitializeNodeAsync(context);

        return OpStatus.OK;
      }
    }
  `;

  $(".result-section").removeClass("hidden");
  $(".result-section-inner").html(`
    <pre>
      <code>${result}</code>
    </pre>
  `);
}
