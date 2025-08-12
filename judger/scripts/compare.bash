file1="$1"
file2="$2"

diff <( (cat "$file1"; echo) | sed 's/^[ \t]*//;s/[ \t]*$//' | sed '/^\s*$/d' ) \
     <( (cat "$file2"; echo) | sed 's/^[ \t]*//;s/[ \t]*$//' | sed '/^\s*$/d' )

exit $?
