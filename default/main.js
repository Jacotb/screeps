 v a r   r o l e W o r k e r   =   r e q u i r e ( ' r o l e . w o r k e r ' ) ; 
 v a r   r o l e S o l d i e r   =   r e q u i r e ( ' r o l e . s o l d i e r ' ) ; 
 v a r   r o l e M i n e r   =   r e q u i r e ( ' r o l e . m i n e r ' ) ; 
 v a r   t o w e r s   =   r e q u i r e ( ' t o w e r s ' ) ; 
 v a r   c l e a n e r   =   r e q u i r e ( ' c l e a n e r ' ) 
 v a r   s p a w n e r   =   r e q u i r e ( ' s p a w n e r ' ) 
 v a r   b u i l d e r   =   r e q u i r e ( ' b u i l d e r ' ) ; 
 
 m o d u l e . e x p o r t s . l o o p   =   f u n c t i o n   ( )   { 
         v a r   a c t i v e R o o m s   =   [ 
                 G a m e . r o o m s [ ' W 7 9 S 8 3 ' ] , 
                 G a m e . r o o m s [ ' W 7 9 S 8 4 ' ] , 
         ] ; 
         
         c l e a n e r . t i c k ( ) ; 
         
         v a r   s p a w n s   =   G a m e . s p a w n s ; 
         _ . f o r E a c h ( s p a w n s ,   f u n c t i o n ( s p a w n ) { 
                 s p a w n e r . t i c k ( s p a w n ) ; 
         } ) ; 
         
         a c t i v e R o o m s . f o r E a c h ( f u n c t i o n ( r o o m ) { 
                 b u i l d e r . t i c k ( r o o m ) ; 
                 t o w e r s . t i c k ( r o o m ) ; 
         } ) ; 
 
         f o r ( v a r   n a m e   i n   G a m e . c r e e p s )   { 
                 v a r   c r e e p   =   G a m e . c r e e p s [ n a m e ] ; 
                 i f ( c r e e p . m e m o r y . r o l e   = =   ' m i n e r ' )   { 
                         r o l e M i n e r . r u n ( c r e e p ) ; 
                 } 
                 i f ( c r e e p . m e m o r y . r o l e   = =   ' w o r k e r ' )   { 
                         r o l e W o r k e r . r u n ( c r e e p ) ; 
                 } 
                 i f ( c r e e p . m e m o r y . r o l e   = =   ' s o l d i e r ' )   { 
                         r o l e S o l d i e r . r u n ( c r e e p ) ; 
                 } 
                 i f ( c r e e p . m e m o r y . r o l e   = =   ' a r c h e r ' )   { 
                         r o l e S o l d i e r . r u n ( c r e e p ) ; 
                 } 
         } 
 }