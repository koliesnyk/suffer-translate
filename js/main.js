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
  return _p8() + _p8(true) + _p8(true) + _p8();
}

function generateCode() {
  var result = "";
  var fieldResults = "";
  var translationResults = "";

  var className = $("input[name=class-name]").val();

  $(".fields .fieldset").each(function (index) {
    var text = $(this).find("input[name=text]").val();
    var translation = $(this).find("input[name=translation]").val();
    var stringName = text.replace(/[^a-zA-Z ]/g, "");

    fieldResults += `
      [Ordinal(${index + 1})]
      [ID("{${createGuid()}}")]
      [Caption("${text} Text Caption")]
      [Access(AccessLevel.System)]
      public MetaStoreString ${stringName}Caption { get; set; } = new("${text}");
    `;

    translationResults += `
            ${stringName}Caption.SetRootValueByLanguage("${translation}", "de-DE");`;
  });

  result = `
    public class ${className}Info : MetaStoreContainer
    {
        ${fieldResults}
        public Dictionary&lt;int, MetaStoreString> Folders { get; set; } = new Dictionary&lt;int, MetaStoreString>();
        public override async ValueTask&lt;OpResult> InitializeNodeAsync(IMetaStoreContext context, bool forceInit = false)
        {
            await base.InitializeNodeAsync(context);
            ${translationResults}

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
