MARKDOWN=../content
WORK_DIR=tex2pdf
SOURCE=$(WORK_DIR)/source
OUTPUT_DIR=$(WORK_DIR)/build

TXT_FILES=$(wildcard $(MARKDOWN)/psalms/*.txt)
JSON_FILES_FROM_TXT=$(TXT_FILES:$(MARKDOWN)/psalms/%.txt=buildPsalm/psalms/%.json)

LATEX_FILES=$(wildcard $(MARKDOWN)/*.tex)
COPIED_LATEX_FILES=$(LATEX_FILES:$(MARKDOWN)/%.tex=$(SOURCE)/%.tex)

all: parse $(COPIED_LATEX_FILES) $(WORK_DIR)/core.tex hyphenate pdf | $(OUTPUT_DIR)

pdf:
	cd $(WORK_DIR) && lualatex --output-directory=build core.tex

pdf-fr:
	cd $(WORK_DIR) && lualatex --output-directory=build core-fr.tex

parse: $(COPIED_LATEX_FILES) $(JSON_FILES_FROM_TXT) $(MARKDOWN)/*.md | $(SOURCE)
	node dist/md2tex/main.js parse ../content/md.list -o $(SOURCE)/parsed.tex

parse-fr: $(COPIED_LATEX_FILES) $(JSON_FILES_FROM_TXT) $(MARKDOWN)/*.md | $(SOURCE)
	node dist/md2tex/main.js parse -t ../content/md.list -o $(SOURCE)/parsed-fr.tex

print: $(WORK_DIR)/core.tex
	cd $(WORK_DIR) && lualatex --output-directory=build print/print.tex

print-fr: $(WORK_DIR)/core-fr.tex
	cd $(WORK_DIR) && lualatex --output-directory=build print/print-fr.tex

$(SOURCE)/%.tex: $(MARKDOWN)/%.tex | $(SOURCE)
	cp $< $@

buildPsalm/psalms/%.json: $(MARKDOWN)/psalms/%.txt
	cat $< | php buildPsalm/parsePsalms.php > $@

hyphenate: $(MARKDOWN)/*.tex $(MARKDOWN)/*.md $(MARKDOWN)/psalms/*.txt
	echo "\\hyphenation{" > $(SOURCE)/hyphens.tex
	cat $(MARKDOWN)/*.tex $(MARKDOWN)/*.md $(MARKDOWN)/psalms/*.txt | php $(WORK_DIR)/hyphen/get-words.php | example $(WORK_DIR)/hyphen/hyph_la_VA.dic /dev/stdin | sed 's/=/-/g' >> $(SOURCE)/hyphens.tex
	echo "}" >> $(SOURCE)/hyphens.tex

$(SOURCE):
	mkdir -p $(SOURCE)

$(OUTPUT_DIR):
	mkdir -p $(OUTPUT_DIR)

clean:
	rm -rf $(OUTPUT_DIR) $(SOURCE)

.PHONY: all clean
